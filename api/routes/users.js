const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/users');

/**
 * @swagger
 * paths:
 *   /users/:
 *     get:
 *       tags: ['Users']
 *       summary: Get all users.
 *       description: Get all users in the database.
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           type: string
 *       responses:
 *         200:
 *           description: Receive back all users with their email and ID.
 *           schema:
 *             name: users
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               userId:
 *                 type: string
 *                 description: The user's ID.
 *         500:
 *           description: Error message.
 */

router.get('/', checkAuth, UserController.get_all);

/**
 * @swagger
 * paths:
 *   /users/signup:
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
 *           schema:
 *             name: createdUser
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: Will always say 'encrypted'.
 *               userId:
 *                 type: string
 *                 description: The user's ID
 *         409:
 *           description: Email already exists, please login
 */

router.post('/signup', UserController.signup);

/**
 * @swagger
 * paths:
 *   /users/login:
 *     post:
 *       tags: ['Users']
 *       summary: Log in as an existing user
 *       description: Login
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
 *         200:
 *           description: Login successful, generates bearer token.
 *           message: Successfully logged in, please copy your bearer token below
 *           token: bearer token
 *         401:
 *           description: User doesn't exist or incorrect password provided
 *           message: Auth failed
 */

router.post('/login', UserController.login);

/**
 * @swagger
 * paths:
 *   /users/{userId}:
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
