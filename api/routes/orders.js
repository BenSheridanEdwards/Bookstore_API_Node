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

router.delete('/:orderId', checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order successfully deleted',
        request: {
          message: 'Create a new order',
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: {
            productId: 'ID',
            quantity: 'Number',
          },
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
