const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, hasPermission } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/register', upload.single('foto'), authController.register);
router.post('/login', authController.login);

// Rutas protegidas por token y permiso de perfil
router.get('/profile', verifyToken, hasPermission('user:profile'), authController.getProfile);
router.post('/verify-password', verifyToken, hasPermission('user:profile'), authController.verifyPassword);
router.put('/profile', verifyToken, hasPermission('user:profile'), upload.single('foto'), authController.updateProfile);

// Rutas públicas de recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
