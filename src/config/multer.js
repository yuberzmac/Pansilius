const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración para subida de fotos de perfil y productos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = req.query.dest || 'uploads/';
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Si viene del explorador de archivos, mantenemos el nombre original
    if (req.query.dest) {
        cb(null, file.originalname);
    } else {
        // Si es una subida de perfil/producto, generamos nombre único
        cb(null, Date.now() + path.extname(file.originalname));
    }
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

module.exports = upload;
