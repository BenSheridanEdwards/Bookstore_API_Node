const express = require('express');

const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Extended: http://swagger.io/specifcation/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Store RESTful API',
      description: 'Online shop API',
      contact: {
        name: 'Ben Sheridan-Edwards',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: [
    './api/routes/products.js',
    './api/routes/orders.js',
    './api/routes/users.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  `mongodb+srv://BenSE:${process.env.MONGO_ATLAS_PW}@node-store-api-vsila.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
