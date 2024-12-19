require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var loginRouter = require('./routes/login');
var brandsRouter = require("./routes/brands");
var categoriesRouter = require("./routes/categories");
var rolesRouter = require("./routes/roles");
var ordersRouter = require('./routes/orders');
var membershipsRouter = require("./routes/memberships");
var searchRouter = require("./routes/search");

var app = express();

// FJERN DETTE MOT SLUTTEN Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
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
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(session({
    secret: "abc123",
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/products', productsRouter);
app.use("/search", searchRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use("/brands", brandsRouter);
app.use("/categories", categoriesRouter);
app.use("/roles", rolesRouter);
app.use('/orders', ordersRouter);
app.use("/memberships", membershipsRouter);
app.use('/', indexRouter);


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
