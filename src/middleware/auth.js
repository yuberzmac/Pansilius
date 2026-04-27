const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Intentar obtener el token del header o de los parámetros de la URL
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_seguro');
    
    // VERIFICACIÓN DE SESIÓN ACTIVA (Force Logout check)
    const [userRows] = await pool.execute('SELECT token_version FROM users WHERE id = ?', [decoded.id]);
    
    if (userRows.length === 0 || userRows[0].token_version !== decoded.version) {
      return res.status(401).json({ message: 'Sesión invalidada o cerrada remotamente' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const hasPermission = (permissionSlug) => {
  return async (req, res, next) => {
    try {
      // 1. Obtener el role_id del usuario desde la DB (fuente de verdad)
      const [userRows] = await pool.execute('SELECT id_roles FROM users WHERE id = ?', [req.user.id]);
      
      if (userRows.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const userRoleId = userRows[0].id_roles;

      // 2. Verificar si ese rol tiene el permiso solicitado
      const [permRows] = await pool.execute(`
        SELECT p.slug 
        FROM permisos p
        JOIN role_permisos rp ON p.id = rp.permiso_id
        WHERE rp.role_id = ? AND p.slug = ?
      `, [userRoleId, permissionSlug]);

      if (permRows.length === 0) {
        console.log(`⛔ Acceso denegado: Usuario ${req.user.username} (Rol ID: ${userRoleId}) no tiene permiso '${permissionSlug}'`);
        return res.status(403).json({ message: `No tienes el permiso necesario: ${permissionSlug}` });
      }

      next();
    } catch (error) {
      console.error('❌ Error en middleware de permisos:', error);
      res.status(500).json({ message: 'Error interno de seguridad', error: error.message });
    }
  };
};

module.exports = { verifyToken, hasPermission };
