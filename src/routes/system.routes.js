const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { verifyToken, hasPermission } = require('../middleware/auth');
const upload = require('../config/multer');

// Todas las rutas requieren Admin:Panel
router.use(verifyToken);
router.use(hasPermission('admin:panel'));

// Explorador de Archivos
router.get('/files', systemController.listDirectory);
router.get('/file/content', systemController.getFileContent);
router.post('/file/save', systemController.saveFileContent);
router.get('/file/download', systemController.downloadFile);
router.post('/file/delete', systemController.deleteItem);
router.post('/file/upload', upload.single('file'), systemController.uploadFile);

// Sistema
router.get('/logs', systemController.getLogs);
router.get('/stats', systemController.getSystemStats);
router.get('/storage-analysis', systemController.getStorageAnalysis);
router.get('/db-tables', systemController.getDatabaseTables);
router.post('/terminal', systemController.executeCommand);

module.exports = router;
