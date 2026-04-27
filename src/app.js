const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// --- Configuración de Plantillas (EJS - El PHP de Node) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Middleware Global ---
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());app.use(express.urlencoded({ extended: true }));

// --- Archivos Estáticos ---
app.use(express.static(path.join(__dirname, '../public'), { extensions: ['html'] }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Rutas de API ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/items', require('./routes/items.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/shop', require('./routes/shop.routes'));
app.use('/api/system', require('./routes/system.routes'));

// --- Rutas de Vistas ---
app.get('/dashboard', (req, res) => res.render('menupanel'));
app.get('/users', (req, res) => res.render('users'));
app.get('/system', (req, res) => res.render('system'));
app.get('/terminal', (req, res) => res.render('terminal'));
app.get('/tienda', (req, res) => res.sendFile(path.join(__dirname, 'views/tienda.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(path.join(__dirname, '../public/reset-password.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

// --- Manejo de Errores 404 ---
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;
