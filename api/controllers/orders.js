const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
          product: doc.product,
          quantity: doc.quantity,
          orderId: doc._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        })),
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.create_order = (req, res, next) => {
  Product.findById(req.body.productId).then(product => {
    if (!product) {
      return res.status(500).json({
        message: 'Product not found',
      });
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });
    order
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Order successfully created',
          createdOrder: {
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${result._id}`,
          },
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
};
