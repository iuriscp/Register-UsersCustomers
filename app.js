const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport")
const authMiddleware = require("./authMiddleware")
const session = require('express-session');
const MongoStore = require("connect-mongo");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customers');
const loginRouter = require('./routes/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

authMiddleware(passport);

app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_CONNECTION,
    dbName: process.env.MONGODB_DATABASE,
    ttl: 30*60,
    autoRemove: "native"
  }),

  secret: process.env.MONGO_STORE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 30*60*100}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customersRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
