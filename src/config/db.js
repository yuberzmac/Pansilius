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

// Función para inicializar las tablas automáticamente
const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('📦 Verificando tablas en la base de datos...');

    // Crear tabla users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(100),
        telefono VARCHAR(20),
        foto TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        estado BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tablas verificadas/creadas correctamente.');
    connection.release();
  } catch (error) {
    console.error('❌ Error al inicializar las tablas:', error.message);
  }
};

initDB();

module.exports = pool;
