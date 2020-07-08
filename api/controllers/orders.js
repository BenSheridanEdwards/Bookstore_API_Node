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
          productId: doc.product,
          quantity: doc.quantity,
          orderId: doc._id,
          request: {
            type: 'GET',
            url: `https://bse-book-store-api.herokuapp.com/orders/${doc._id}`,
          },
        })),
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order: {
          productId: order.product,
          quantity: order.quantity,
          _id: order._id,
        },
        request: {
          message: 'Get all orders',
          type: 'GET',
          url: 'https://bse-book-store-api.herokuapp.com/orders',
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_order = (req, res, next) => {
  Product.findById(req.body.productId).then(product => {
    if (!product) {
      return res.status(404).json({
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
            productId: result.product,
            quantity: result.quantity,
            orderId: result.orderId,
          },
          request: {
            type: 'GET',
            url: `https://bse-book-store-api.herokuapp.com/${result._id}`,
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

exports.change_order = (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Order successfully updated',
        request: {
          message: 'See updated order',
          type: 'GET',
          url: `https://bse-book-store-api.herokuapp.com/${id}`,
        },
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_order = (req, res, next) => {
  Order.findById(req.params.orderId).then(order => {
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }
    order
      .remove({ _id: req.params.orderId })
      .then(result => {
        console.log(result);
        res.status(200).json({
          message: 'Order successfully deleted',
          request: {
            message: 'Create a new order',
            type: 'POST',
            url: 'https://bse-book-store-api.herokuapp.com/orders',
            body: {
              productId: 'ID',
              quantity: 'Number',
            },
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
