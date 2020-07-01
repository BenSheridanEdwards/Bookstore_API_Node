const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 25,
  },
  fileFilter,
});

const Product = require('../models/product');

router.get('/', ProductController.get_all);

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: `http://localhost:3000/${req.file.path}`,
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          image: result.productImage,
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`,
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

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: {
            name: doc.name,
            price: doc.price,
            image: doc.productImage,
            _id: doc._id,
          },
          request: {
            message: 'Get all products',
            type: 'GET',
            url: 'http://localhost:3000/products',
          },
        });
      } else {
        res.status(404).json({ message: 'No valid entry for provided ID' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Updated product successfully',
        request: {
          message: 'See updated product',
          type: 'GET',
          url: `http://localhost:3000/products/${id}`,
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

router.delete('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          message: 'Create a new product with a post request',
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String',
            price: 'Number',
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

module.exports = router;
