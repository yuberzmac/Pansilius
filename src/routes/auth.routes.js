const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
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
router.get('/profile', verifyToken, authController.getProfile);
router.post('/verify-password', verifyToken, authController.verifyPassword);
router.put('/profile', verifyToken, upload.single('foto'), authController.updateProfile);

module.exports = router;
