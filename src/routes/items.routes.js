const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items.controller');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas de items requieren autenticación
router.use(verifyToken);

router.get('/', itemsController.getItems);
router.get('/:id', itemsController.getItemById);
router.post('/', itemsController.createItem);
router.put('/:id', itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
