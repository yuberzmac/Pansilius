const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('📦 Sincronizando Seguridad Pansilius PRO...');

    // 1. Roles
    await connection.query(`CREATE TABLE IF NOT EXISTS roles (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(50) UNIQUE NOT NULL)`);
    await connection.query("INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'admin'), (2, 'user')");

    // 2. Permisos
    await connection.query(`CREATE TABLE IF NOT EXISTS permisos (id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(50) UNIQUE NOT NULL, descripcion VARCHAR(100))`);
    
    // 3. Usuarios (Asegurar columna id_roles)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        username VARCHAR(100) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL, 
        nombre VARCHAR(100), 
        telefono VARCHAR(20), 
        foto TEXT, 
        id_roles INT DEFAULT 2, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (id_roles) REFERENCES roles(id) ON DELETE SET NULL
      )
    `);

    // 4. Role-Permisos
    await connection.query(`CREATE TABLE IF NOT EXISTS role_permisos (role_id INT, permiso_id INT, PRIMARY KEY(role_id, permiso_id), FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE, FOREIGN KEY(permiso_id) REFERENCES permisos(id) ON DELETE CASCADE)`);

    // 5. Definir y asegurar todos los permisos
    const perms = [
      ['item:view', 'Ver catálogo de productos'],
      ['item:create', 'Agregar nuevos productos'],
      ['item:edit', 'Modificar productos existentes'],
      ['item:delete', 'Eliminar productos'],
      ['user:view', 'Ver lista de personal/clientes'],
      ['user:manage', 'Gestionar roles y usuarios'],
      ['user:profile', 'Gestionar perfil propio'],
      ['shop:buy', 'Realizar compras en la tienda'],
      ['admin:panel', 'Acceso total al panel administrativo']
    ];

    for (const [slug, desc] of perms) {
      await connection.query('INSERT IGNORE INTO permisos (slug, descripcion) VALUES (?, ?)', [slug, desc]);
    }

    // 6. Sincronización Maestra de Roles y Permisos
    // Admin (ID 1) tiene TODO
    await connection.query("INSERT IGNORE INTO role_permisos (role_id, permiso_id) SELECT 1, id FROM permisos");
    
    // User (ID 2) tiene lo básico
    await connection.query(`
      INSERT IGNORE INTO role_permisos (role_id, permiso_id) 
      SELECT 2, id FROM permisos WHERE slug IN ('item:view', 'user:profile', 'shop:buy')
    `);

    // 7. Forzar Admin a Yuber
    await connection.query("UPDATE users SET id_roles = 1 WHERE username = 'yuber'");

    console.log('✅ Sistema de seguridad Pansilius PRO sincronizado al 100%.');
    connection.release();
  } catch (error) {
    console.error('❌ Error crítico en DB:', error.message);
  }
};

initDB();
module.exports = pool;
