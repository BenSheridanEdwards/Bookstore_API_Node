const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/users');

/**
 * @swagger
 * paths:
 *   /user/signup:
 *     post:
 *       tags: ['Users']
 *       summary: Create a new user
 *       description: Create a user
 *       consumes:
 *         - application/json
 *       parameters:
 *         - in: body
 *           name: user
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: test@test.com
 *               password: password
 *       responses:
 *         201:
 *           description: User successfully created
 *         409:
 *           description: Email already exists, please login
 */

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

/**
 * @swagger
 * paths:
 *   /user/{userId}:
 *     delete:
 *       tags: ['Users']
 *       summary: Delete a user by ID
 *       description: Delete a user - For authorization, your need a bearer token from logging in. Enter your token into the 'Authorization' input box below.
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *         - in: header
 *           name: Authorization
 *           type: string
 *       responses:
 *         '200':
 *           description: User successfully deleted
 *         '404':
 *            description: User not found.
 *            content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: No valid entry for provided ID
 */

router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;
