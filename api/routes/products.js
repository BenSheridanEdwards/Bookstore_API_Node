const express = require('express');

const router = express.Router();
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

/**
 * @swagger
 * paths:
 *   /products/:
 *     get:
 *       tags: ['Products']
 *       summary: Get all products.
 *       responses:
 *         200:
 *           description: Receive back all products with their name, price and ID.
 *           schema:
 *             name: products
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product's name.
 *               price:
 *                 type: integer
 *                 description: The product's price.
 *               productId:
 *                 type: string
 *                 description: The product's ID.
 *         500:
 *           description: Error message.
 */

router.get('/', ProductController.get_all);

/**
 * @swagger
 * paths:
 *   /products/{productId}:
 *     get:
 *       tags: ['Products']
 *       summary: Get a product by ID.
 *       parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Receive back details of the specific product related to the given productId.
 *           schema:
 *             name: product
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product's name.
 *               price:
 *                 type: integer
 *                 description: The product's price.
 *               _id:
 *                 type: string
 *                 description: The product's ID.
 *         404:
 *           description: Product not found.
 *         500:
 *           description: Error message.
 */

router.get('/:productId', ProductController.get_product);

/**
 * @swagger
 * paths:
 *   /products/:
 *     post:
 *       tags: ['Products']
 *       summary: Create a new product.
 *       description: Create a product - For authorization, your need a bearer token from logging in. Enter your token into the input box below.
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: product
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *             example:
 *               name: The origin of species
 *               price: 3.59
 *         - in: header
 *           name: Authorization
 *           type: string
 *       responses:
 *         201:
 *           description: Product successfully created
 *           schema:
 *             name: createdProduct
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product's name
 *               price:
 *                 type: integer
 *                 description: The product's price
 *               productId:
 *                 type: string
 *                 description: The product's ID.
 *         500:
 *           description: Error message.
 */

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductController.create_product
);

/**
 * @swagger
 * paths:
 *   /products/{productId}:
 *     patch:
 *       tags: ['Products']
 *       summary: Update a product.
 *       description: Update a product - For authorization, your need a bearer token from logging in. Enter your token into the input box below.
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: string
 *           required: true
 *         - in: body
 *           name:  Product properties to update.
 *           schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  propName:
 *                    type: string
 *                  value:
 *                    type: string
 *         - in: header
 *           name: Authorization
 *           type: string
 *       responses:
 *         200:
 *           description: Product successfully updated.
 *         500:
 *           description: Error message.
 *
 */

router.patch('/:productId', checkAuth, ProductController.change_product);

/**
 * @swagger
 * paths:
 *   /products/{productId}:
 *     delete:
 *       tags: ['Products']
 *       summary: Delete a product by ID.
 *       description: Delete a product - For authorization, your need a bearer token from logging in. Enter your token into the 'Authorization' input box below.
 *       parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: string
 *           required: true
 *         - in: header
 *           name: Authorization
 *           type: string
 *       responses:
 *         200:
 *           description: Product successfully deleted.
 *         404:
 *           description: Product not found.
 *           content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: No valid entry for provided ID
 *         500:
 *           description: Error message.
 */

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;
