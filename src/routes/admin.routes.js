const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const shopController = require('../controllers/shop.controller');
const { verifyToken, hasPermission } = require('../middleware/auth');

router.use(verifyToken);

router.get('/users', hasPermission('user:view'), adminController.getAllUsers);
router.get('/roles/list', hasPermission('user:manage'), adminController.getAllRoles);
router.put('/users/role', hasPermission('user:manage'), adminController.updateUserRole);
router.delete('/users/:id', hasPermission('user:manage'), adminController.deleteUser);
router.post('/roles', hasPermission('user:manage'), adminController.createRole);
router.get('/permisos', hasPermission('user:manage'), adminController.getAllPermissions);
router.get('/roles/:roleId/permisos', hasPermission('user:manage'), adminController.getRolePermissions);
router.post('/roles/toggle-permiso', hasPermission('user:manage'), adminController.togglePermission);
router.get('/reports/sales', hasPermission('admin:panel'), shopController.getAllSales);

module.exports = router;
