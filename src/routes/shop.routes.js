const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const { verifyToken, hasPermission } = require('../middleware/auth');

router.use(verifyToken);

router.post('/buy', hasPermission('shop:buy'), shopController.buyItem);
router.get('/my-purchases', shopController.getMyPurchases);

module.exports = router;
