"use strict";
var express = require("express");
var app = express();
var server = require("http").Server(app);
var path = require("path");
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var errorHandler = require('errorhandler');

var listRouter = require('./scripts/routes/listRouter');
var userRouter = require('./scripts/routes/userRouter');
require('./config/passport');

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));
app.use(session({
	secret: 'passport',
	cookie: { maxAge: 60000 },
	resave: false,
	saveUninitialized: false
}));

//Set mongoose connection
var mongoose = require('mongoose');
//var mongoDB = 'mongodb://mongo:27017/localLibrary';
var mongoDB = 'mongodb://192.168.99.100:27017/localLibrary';
mongoose.connect(mongoDB);
mongoose.set('debug',true);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/dist/views"));

app.get('/', (req, res) => {

  res.redirect('/user');
});

app.use('/list', listRouter);
app.use('/user', userRouter);

if(!isProduction) {
  app.use((err, req, res, next) => {

    if(err.name === 'UnauthorizedError') {
      console.log(err.message);
      res.redirect('/user/login');
    }

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res, next) => {

  if(err.name === 'UnauthorizedError') {
    console.log(err.message);
    res.redirect('/user/login');
  }

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

server.listen(PORT, function() {

	console.log(`Listening on ${PORT}`);
});