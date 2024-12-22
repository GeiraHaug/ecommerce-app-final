require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var initializeDatabaseRouter = require('./routes/initializeDatabase');
var authRouter = require('./routes/auth');
var productRouter = require('./routes/products');
var categoryRouter = require('./routes/categories');
var cartRouter = require('./routes/cart');
var brandRouter = require('./routes/brands');
var searchRouter = require('./routes/search');
var orderRouter = require('./routes/orders');
var roleRouter = require('./routes/roles');
var membershipRouter = require('./routes/memberships');

var swaggerUi = require('swagger-ui-express');
var swaggerFile = require('./swagger-output.json');
var bodyParser = require('body-parser');

var app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/init', initializeDatabaseRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/cart', cartRouter);
app.use('/brands', brandRouter);
app.use('/search', searchRouter);
app.use('/orders', orderRouter);
app.use('/roles', roleRouter);
app.use('/memberships', membershipRouter);

app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
