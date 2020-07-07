const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.get_all = (req, res, next) => {
  User.find()
    .select('email _id')
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        users: docs.map(doc => ({
          email: doc.email,
          _id: doc._id,
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

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists, please login',
          url: 'https://bse-book-store-api.herokuapp.com/users/login',
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        newUser
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User successfully created',
              createdUser: {
                _id: result._id,
                email: result.email,
                password: 'encrypted',
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
    });
};

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            message: 'Auth failed',
            error: err,
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].userId,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '24h',
            }
          );
          return res.status(200).json({
            message:
              'Successfully logged in, please copy your bearer token below',
            token,
          });
        }
        res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            message: 'Auth failed',
            error: err,
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].userId,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token,
          });
        }
        res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'User successfully deleted',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
