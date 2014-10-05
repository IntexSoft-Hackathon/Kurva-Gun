'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId,
    rating = require('../controllers/rating');;

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  User.load(id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('Failed to load checklist ' + id));
    }
    req.user = user;
    next();
  });
};

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save(function (err) {
    if (err) {
      return res.json(400, err);
    }

    req.logIn(newUser, function (err) {
      if (err) {
        return next(err);
      }
      rating.create(req, res, next, newUser._id);
      return res.json(newUser.user_info);
    });
  });
};

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile});
    } else {
      res.send(404, 'USER_NOT_FOUND');
    }
  });
};

/**
 * Update a user
 */
exports.update = function (req, res) {
  var user = req.user;
  user.username = req.body.username;
  user.name = req.body.name;
  user.email = req.body.email;
  if (req.body.password)
    user.password = req.body.password;
  user.active = req.body.active;
  user.save(function (err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(user);
    }
  });
};

/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
  var username = req.params.username;
  User.findOne({username: username}, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if (user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
};

/**
 *  Find All
 *  returns all users
 */
exports.find = function (req, res, next) {
  User.find({},{salt:0, hashedPassword:0}).exec(function (err, users) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    res.json(users);
  });
};

