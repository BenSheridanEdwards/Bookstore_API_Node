const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

/**
 * @swagger
 * paths:
 *   /orders/:
 *     get:
 *       tags: ['Orders']
 *       summary: Get all orders
 *       description: Get all orders in the database - For authorization, your need a bearer token from logging in. Insert bearer followed by your token into the authorization input box below. It should look like this "bearer yourTokenHere".
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *       responses:
 *         200:
 *           description: Receive back all orders with the productId and quantity for each order with the respective order ID.
 */

router.get('/', checkAuth, OrdersController.get_all);

router.get('/:orderId', checkAuth, OrdersController.get_order);

router.post('/', checkAuth, OrdersController.create_order);

router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;
