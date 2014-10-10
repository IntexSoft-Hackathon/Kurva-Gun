'use strict';

// Module dependencies.
var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    fs = require('fs'),
    mongoStore = require('connect-mongo')(express),
    config = require('./lib/config/config');

var app = express();

var db = require('./lib/db/mongo').db;

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var pass = require('./lib/config/pass');

// App Configuration
app.configure('development', function(){
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/app/views');
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');

});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');
app.use(express.logger('dev'));

// cookieParser should be above session
app.use(express.cookieParser());

// bodyParser should be above methodOverride
app.use(express.bodyParser());
app.use(express.methodOverride());

// express/mongo session storage
app.use(express.session({
  secret: 'MEAN',
  store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

//routes should be at the last
app.use(app.router);

//mailer
var mailer = require('express-mailer');

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'vadim.chadyuk@gmail.com',
    pass: 'Phoenixhp08081991CVS'
  }
});


// Start server
var port = process.env.PORT || 3000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
exports.io = io;

var arduino = require('./lib/controllers/arduino.js');
exports.arduino = new arduino();

var userController = require('./lib/controllers/users');
exports.userController= new userController();

var gameController = require('./lib/controllers/game');
exports.gameController = new gameController();

var achievementsCollection = require('./lib/models/achievements');
exports.achievementsCollection = new achievementsCollection();

require('./lib/controllers/achievements');
require('./lib/controllers/statisctic');

// Connect to database

//Bootstrap routes
require('./lib/config/routes')(app, io);

process.on('uncaughtException', function(err) {
  throw err;
});

server.listen(port, function () {
  //console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
