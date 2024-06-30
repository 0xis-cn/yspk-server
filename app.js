var createError = require('http-errors');
var express = require('express');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express()

const session = require('express-session')
app.use(session({
	secret: (process.env.COOKIE_SECRET || 'demo'),
	resave: false,
	saveUninitialized: true,
}))

const passport = require('passport')
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
const path = require('path')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.locals.user = req.user
  return next()
})

require('express-ws')(app)

app.use('/', require('./routes/login'))
app.use('/', require('./routes/room'))

app.get('/', (req, res) => res.render('home', { title: '欢迎' }))

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
  res.send(res.locals.message)
});

module.exports = app;
