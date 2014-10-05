'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function (app, io) {
  var users = require('../controllers/users');
  var rating = require('../controllers/rating');
  // User Routes
  app.get('/auth/users', users.find);
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);
  app.put('/auth/users/:userId', users.update);
  // Rating Routes
  app.get('/api/rating', rating.find);
  app.post('/api/rating', rating.create);
  app.get('/api/rating/:userId', rating.show);
  app.put('/api/rating/:userId', rating.update);

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
