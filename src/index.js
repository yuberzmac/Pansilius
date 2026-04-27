const app = require('./app');
const pool = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- Lógica de Terminal Real (Bash con Emulación de TTY) ---
io.on('connection', (socket) => {
  // Usamos 'script' para forzar a bash a creer que tiene una terminal real (TTY)
  // Esto activa los colores de 'ls' y el prompt correctamente.
  const shell = spawn('script', ['-qfec', 'bash', '/dev/null'], {
    env: { ...process.env, TERM: 'xterm-256color', LANG: 'en_US.UTF-8' },
    cwd: process.cwd()
  });

  shell.stdout.on('data', (data) => socket.emit('output', data.toString()));
  
  shell.on('error', (err) => {
    socket.emit('output', `\r\n\x1b[31m[ERROR] No se pudo iniciar Pansilius Shell: ${err.message}\x1b[0m\r\n`);
  });

  shell.on('exit', (code) => {
    socket.emit('output', `\r\n\x1b[33m[SISTEMA] Terminal finalizada (Código: ${code})\x1b[0m\r\n`);
  });

  // En 'script', la salida estándar y error suelen venir juntas
  socket.on('input', (data) => {
    if (shell.stdin.writable) {
      shell.stdin.write(data);
    }
  });

  socket.on('disconnect', () => {
    try {
      shell.kill();
    } catch (e) {}
  });
});

server.listen(PORT, async () => {
  console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`🚀 Motor de Terminal Real Activo (Pansilius Shell)`);
  
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    console.log('✅ Conexión a la base de datos MySQL establecida con éxito.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos.');
  }
});
