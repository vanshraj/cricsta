var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongo =require('mongodb');
var mongoose =require('mongoose');
var htmlsave = require('htmlsave');
mongoose.connect( process.env.DATABASEURL);
var db =mongoose.connection;

var index = require('./routes/index');
var users = require('./routes/users');
var blogs = require('./routes/blogs');
var admin = require('./routes/admin');
var game = require('./routes/game');

var app = express();

app.locals.moment = require('moment');
app.locals.truncateText = function(text, length){
  return htmlsave.truncate(text,length,{breakword: false});
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Handle session
app.use(session({ secret:'secret', saveUninitialized: true, resave: true}));
//Handle passport
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/blog', blogs);
app.use('/admin', admin);
app.use('/game', game);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('layout',{'error':true});
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
