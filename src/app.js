const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en tiempo
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta raíz redirige a login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Rutas de Autenticación
const authController = require('./controllers/auth.controller');
app.post('/register', upload.single('foto'), authController.register); // 'foto' es el nombre del campo en el form
app.post('/login', authController.login);

// Rutas del CRUD principal
app.use('/api/items', require('./routes/items.routes'));

module.exports = app;
