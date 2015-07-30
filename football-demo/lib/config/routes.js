'use strict';

var path = require('path'),
    auth = require('../config/auth'),
    mobileDetect = require('mobile-detect');

module.exports = function (app) {
    var users = require('../../app.js').userController;
    var game = require('../../app.js').gameController;
    // User Routes
    app.get('/auth/users', users.find);
    app.post('/auth/users', users.create);
    app.post('/auth/users/uploadImage', users.uploadImage);
    app.get('/auth/users/:userId', users.show);
    app.put('/auth/users/:userId', users.update);
    // Game Routes
    app.get('/api/game', game.findStartedGame);
    app.post('/api/game', game.findStartedGame);
    app.get('/api/game/:userId', game.show);
    app.put('/api/game/:gameId', game.update);
    app.post('/api/game/:gameId/start', game.start);
    app.post('/api/game/:gameId/stop', game.stop);
    app.post('/api/queue/update', game.updateQueue);
    app.get('/api/queue', game.queue);
    // Check if username is available
    app.get('/auth/check_username/:username', users.exists);

    // Session Routes
    var session = require('../controllers/session');
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.del('/auth/session', session.logout);

    app.param('gameId', game.game);

    // Angular Routes
    app.get('/partials/*', checkForMobile, function (req, res) {
        var requestedView = path.join('./', req.url);
        res.render(requestedView);
    });

    app.get('/*', function (req, res) {
        if (req.user) {
            res.cookie('user', JSON.stringify(req.user.user_info));
        }
        res.render('index.html');
    });

    function checkForMobile(req, res, next) {
        // check to see if the caller is a mobile device
        var md = new mobileDetect(req.headers['user-agent']);
        console.log(md.mobile());
        console.log(md.tablet());
        if ((md.mobile() || md.mobile() === "UnknownMobile") && md.mobile() !== "iPad") {
            console.log("Going mobile");
            var requestedView = path.join('./mobile/', req.url);
            res.render(requestedView);
        } else {
            // if we didn't detect mobile, call the next method, which will eventually call the desktop route
            return next();
        }
    }

};
