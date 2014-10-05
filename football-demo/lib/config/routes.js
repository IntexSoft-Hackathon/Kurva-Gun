'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function (app, io) {
  var users = require('../controllers/users');
  var game = require('../controllers/game');
  // User Routes
  app.get('/auth/users', users.find);
  app.post('/auth/users', users.create);
  app.post('/auth/users/uploadImage', users.uploadImage);
  app.get('/auth/users/:userId', users.show);
  app.put('/auth/users/:userId', users.update);
  // Game Routes
  app.get('/api/game', game.find);
  app.post('/api/game', game.find);
  app.get('/api/game/:userId', game.show);
  app.put('/api/game/:userId', game.update);

  // Check if username is available
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // Angular Routes
  app.get('/partials/*', function (req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function (req, res) {
    if (req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }
    res.render('index.html');
  });

};
