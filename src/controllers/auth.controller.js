const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password, nombre, telefono } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Usuario, email y contraseña son obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // IMPORTANTE: Asignamos id_roles = 2 (Usuario normal) por defecto
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, nombre, telefono, foto, id_roles) VALUES (?, ?, ?, ?, ?, ?, 2)',
      [username, email, hashedPassword, nombre || null, telefono || null, foto]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.message.includes('username') ? 'usuario' : 'email';
      return res.status(400).json({ message: `Este ${field} ya está en uso` });
    }
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as role_name 
       FROM users u 
       JOIN roles r ON u.id_roles = r.id 
       WHERE u.username = ? OR u.email = ?`, 
      [username, username]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 1. Verificar si la cuenta está bloqueada
    if (user.is_blocked) {
      return res.status(403).json({ message: 'Cuenta bloqueada por seguridad tras 3 intentos fallidos. Contacte al administrador.' });
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Incrementar intentos fallidos
      const newAttempts = user.failed_attempts + 1;
      if (newAttempts >= 3) {
        await pool.execute('UPDATE users SET failed_attempts = ?, is_blocked = TRUE WHERE id = ?', [newAttempts, user.id]);
        return res.status(403).json({ message: 'Cuenta bloqueada tras 3 intentos fallidos.' });
      } else {
        await pool.execute('UPDATE users SET failed_attempts = ? WHERE id = ?', [newAttempts, user.id]);
        return res.status(401).json({ message: `Contraseña incorrecta. Intento ${newAttempts} de 3.` });
      }
    }

    // 3. Login exitoso: Resetear intentos fallidos
    await pool.execute('UPDATE users SET failed_attempts = 0 WHERE id = ?', [user.id]);

    // --- PARCHE DE EMERGENCIA: ASEGURAR QUE YUBER SEA ADMIN ---
    let finalRole = user.role_name;
    if (user.username.toLowerCase() === 'yuber') {
      await pool.execute('UPDATE users SET id_roles = 1 WHERE id = ?', [user.id]);
      finalRole = 'admin';
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: finalRole, version: user.token_version },
      process.env.JWT_SECRET || 'tu_secreto_seguro',
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login exitoso', token, role: finalRole });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(`
      SELECT u.id, u.username, u.email, u.nombre, u.telefono, u.foto, r.nombre as role, r.id as role_id
      FROM users u 
      LEFT JOIN roles r ON u.id_roles = r.id 
      WHERE u.id = ?
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = rows[0];
    user.role = user.role || 'user';

    // Obtener permisos (slugs) asociados a este rol
    if (user.role_id) {
        const [permRows] = await pool.execute(`
          SELECT p.slug 
          FROM permisos p
          JOIN role_permisos rp ON p.id = rp.permiso_id
          WHERE rp.role_id = ?
        `, [user.role_id]);
        user.permissions = permRows.map(p => p.slug);
    } else {
        user.permissions = [];
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const [rows] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    res.json({ message: 'Contraseña verificada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar contraseña', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, nombre, telefono, password } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    let query = 'UPDATE users SET email = ?, nombre = ?, telefono = ?';
    let params = [email, nombre || null, telefono || null];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    if (foto) {
      query += ', foto = ?';
      params.push(foto);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await pool.execute(query, params);
    res.json({ message: 'Perfil actualizado con éxito', foto: foto || undefined });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Este email ya está en uso' });
    }
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

const crypto = require('crypto');
const { sendResetEmail } = require('../config/mail');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'No existe un usuario con ese correo' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora de validez

    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email]
    );

    try {
      await sendResetEmail(email, token);
      res.json({ message: 'Correo de recuperación enviado con éxito' });
    } catch (mailError) {
      console.error('Error enviando mail:', mailError);
      res.status(500).json({ message: 'Error al enviar el correo. Verifica las credenciales SMTP.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // 1. Buscar al usuario que tiene ese token y que no haya expirado
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'El enlace de recuperación es inválido o ha expirado.' });
    }

    const userId = users[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Actualizar contraseña, limpiar tokens e incrementar versión para cerrar sesiones antiguas
    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL, token_version = token_version + 1 WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: '¡Éxito! Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ message: 'Error al procesar el cambio de contraseña', error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, verifyPassword, forgotPassword, resetPassword };
