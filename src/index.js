const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
  
  try {
    // Intentar una consulta simple para verificar la conexión
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    console.log('✅ Conexión a la base de datos MySQL establecida con éxito.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:');
    console.error(error.message);
    console.log('Por favor, verifica las credenciales en el archivo .env y que las tablas existan.');
  }
});
