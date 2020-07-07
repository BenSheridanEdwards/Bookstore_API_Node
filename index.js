const express = require('express');

const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 3000;

// Extended: http://swagger.io/specifcation/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Store RESTful API',
      description: 'Online shop API',
      contact: {
        name: 'Ben Sheridan-Edwards',
      },
      servers: [
        'http://localhost:3000',
        'https://bse-book-store-api.herokuapp.com',
      ],
    },
  },
  apis: [
    './api/routes/products.js',
    './api/routes/orders.js',
    './api/routes/user.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  process.env.MONGODB_URL ||
    `mongodb://user:password1@ds153352.mlab.com:53352/heroku_0qlzz1r2`,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!');
});

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

app.get('/', (req, res) => {
  res.json({
    message:
      'Welcome to my Book Store API, to use this API please navigate to the Swagger UI link below',
    request: {
      type: 'GET',
      url: 'https://bse-book-store-api.herokuapp.com/api-docs/',
    },
  });
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

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
