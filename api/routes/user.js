const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const UserController = require('../controllers/users');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.delete('/:userId', UserController.delete_user);

module.exports = router;
