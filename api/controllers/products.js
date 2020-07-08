const mongoose = require('mongoose');

const Product = require('../models/product');

exports.get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          image: doc.productImage,
          _id: doc._id,
          request: {
            type: 'GET',
            url: `https://bse-book-store-api.herokuapp.com/products/${doc._id}`,
          },
        })),
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found.',
        });
      }
      res.status(200).json({
        product: {
          name: product.name,
          price: product.price,
          _id: product._id,
        },
        request: {
          message: 'Get all products.',
          type: 'GET',
          url: 'https://bse-book-store-api.herokuapp.com/products',
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    // productImage: `http://localhost:3000/${req.file.path}`,
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product creation successful',
        createdProduct: {
          name: result.name,
          price: result.price,
          // image: result.productImage,
          _id: result._id,
          request: {
            type: 'GET',
            url: `https://bse-book-store-api.herokuapp.com/products/${result._id}`,
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
};

exports.change_product = (req, res, next) => {
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
        message: 'Product updated successfully',
        request: {
          message: 'See updated product',
          type: 'GET',
          url: `https://bse-book-store-api.herokuapp.com/products/${id}`,
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

exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  // Product.findById(id).then(product => {
  //   if (!product) {
  //     return res.status(404).json({
  //       message: 'Product not found.',
  //     });
  //   }
  //   product
  //     .remove({ _id: id })
  //     .then(result => {
  //       console.log(result);
  //       res.status(200).json({
  //         message: 'Product successfully deleted.',
  //         request: {
  //           message: 'Create a new product.',
  //           type: 'POST',
  //           url: 'https://bse-book-store-api.herokuapp.com/products/',
  //           body: {
  //             name: 'String',
  //             price: 'Number',
  //           },
  //         },
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(500).json({
  //         error: err,
  //       });
  //     });
  // });

  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          message: 'Create a new product with a post request',
          type: 'POST',
          url: 'https://bse-book-store-api.herokuapp.com/products/',
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
};
