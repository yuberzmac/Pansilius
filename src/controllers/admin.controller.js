const pool = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.username, u.nombre, u.telefono, r.nombre as role, u.created_at 
      FROM users u 
      JOIN roles r ON u.id_roles = r.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const [roleRows] = await pool.execute('SELECT id FROM roles WHERE nombre = ?', [role]);
    if (roleRows.length === 0) return res.status(400).json({ message: 'Rol inválido' });
    
    const roleId = roleRows[0].id;

    await pool.execute('UPDATE users SET id_roles = ? WHERE id = ?', [roleId, userId]);
    res.json({ message: 'Rol de usuario actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el rol', error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre del rol es obligatorio' });

    await pool.execute('INSERT INTO roles (nombre) VALUES (?)', [nombre.toLowerCase()]);
    res.status(201).json({ message: 'Nuevo rol creado con éxito' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Este rol ya existe' });
    }
    res.status(500).json({ message: 'Error al crear rol', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM permisos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener permisos', error: error.message });
  }
};

const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const [rows] = await pool.execute(`
      SELECT p.* FROM permisos p
      JOIN role_permisos rp ON p.id = rp.permiso_id
      WHERE rp.role_id = ?
    `, [roleId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener permisos del rol', error: error.message });
  }
};

const togglePermission = async (req, res) => {
  try {
    const { roleId, permisoId } = req.body;

    // Verificar si ya existe
    const [exists] = await pool.execute('SELECT * FROM role_permisos WHERE role_id = ? AND permiso_id = ?', [roleId, permisoId]);

    if (exists.length > 0) {
      await pool.execute('DELETE FROM role_permisos WHERE role_id = ? AND permiso_id = ?', [roleId, permisoId]);
      res.json({ message: 'Permiso revocado con éxito' });
    } else {
      await pool.execute('INSERT INTO role_permisos (role_id, permiso_id) VALUES (?, ?)', [roleId, permisoId]);
      res.json({ message: 'Permiso concedido con éxito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar permisos', error: error.message });
  }
};

module.exports = { getAllUsers, getAllRoles, updateUserRole, createRole, deleteUser, getAllPermissions, getRolePermissions, togglePermission };
