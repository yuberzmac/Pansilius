const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Backend funcionando correctamente' });
});

// Rutas de Autenticación (según requerimiento)
const authController = require('./controllers/auth.controller');
app.post('/register', authController.register);
app.post('/login', authController.login);

// Rutas del CRUD principal
app.use('/api/items', require('./routes/items.routes'));

module.exports = app;
