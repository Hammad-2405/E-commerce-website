const express = require('express');
const { viewSellerOrders, checkout } = require('../controllers/orderController');
const router = express.Router();

router.get('/viewSellerOrders/:username', viewSellerOrders);
router.post('/checkout', checkout);

module.exports = router;