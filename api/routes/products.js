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
 *       summary: Get all products
 *       description: Get all products in the database
 *       consumes:
 *         — application/json
 *       responses:
 *         200:
 *           description: Receive back all products with their name, price and ID.
 */

router.get('/', ProductController.get_all);

/**
 * @swagger
 * paths:
 *   /products/{productId}:
 *     get:
 *       tags: ['Products']
 *       summary: Get a product by ID
 *       parameters:
 *       - in: path
 *         name: ProductId
 *         schema:
 *           type: string
 *         required: true
 *       consumes:
 *         - application/json
 *       responses:
 *         '200':
 *           description: Details of the product.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   product:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The product's name.
 *                     price:
 *                       type: integer
 *                       description: The product's price.
 *                     _id:
 *                       type: string
 *                       description: The product's ID.
 *         '404':
 *            description: Product not found.
 *            content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: No valid entry for provided ID
 */

router.get('/:productId', ProductController.get_product);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductController.create_product
);

router.patch('/:productId', checkAuth, ProductController.change_product);

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;
