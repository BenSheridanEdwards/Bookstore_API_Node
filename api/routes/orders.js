const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.get_all);

router.post('/', checkAuth, OrdersController.create_order);

router.get('/:orderId', checkAuth, OrdersController.get_order);

router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;
