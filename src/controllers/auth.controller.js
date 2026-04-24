const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, password, nombre, telefono } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, nombre, telefono, foto) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, nombre || null, telefono || null, foto]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute('SELECT id, username, nombre, telefono, foto FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
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
    const { nombre, telefono, password } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    let query = 'UPDATE users SET nombre = ?, telefono = ?';
    let params = [nombre || null, telefono || null];

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
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, verifyPassword };
