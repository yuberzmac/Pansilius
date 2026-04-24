const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items.controller');
const { verifyToken, hasPermission } = require('../middleware/auth');

// Todas las rutas de items requieren autenticación
router.use(verifyToken);

// Solo ver: permitido para todos con permiso de vista
router.get('/', hasPermission('item:view'), itemsController.getItems);
router.get('/:id', hasPermission('item:view'), itemsController.getItemById);

// Acciones protegidas por permisos específicos
router.post('/', hasPermission('item:create'), itemsController.createItem);
router.put('/:id', hasPermission('item:edit'), itemsController.updateItem);
router.delete('/:id', hasPermission('item:delete'), itemsController.deleteItem);

module.exports = router;

module.exports = router;
