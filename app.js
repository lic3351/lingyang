var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');



var index = require('./routes/index');
var users = require('./routes/users');
var article=require('./routes/article');
var manager=require('./routes/manager');
//提供 服务
var services=require('./routes/services');

var app = express();

app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: true, 
  saveUninitialized: false,
  cookie: { maxAge: 600000 }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  
  res.locals.session = req.session;
  // res.locals.authenticated = ! req.user.anonymous;
  next();
});



app.use('/', index);
app.use('/u', users);
app.use('/article',article);
app.use('/s',services);
app.use('/m',manager);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
