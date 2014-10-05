'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId,
    app = require('../../app.js'),
    fs = require('fs'),
    im = require('imagemagick');

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
      emitNewUser(app.io, users);
      user.create(req, res, next, newUser._id);
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

var emitNewUser = function(io, data){
    console.log('Emmited');
    io.sockets.emit('user:new', data);
};

/**
 *  upload image profile
 */
exports.uploadImage = function (req, res, next) {
  fs.readFile(req.files.file.path, function (err, data) {
    var imageName = req.files.file.name;
    /// If there's an error
    if(!imageName){

      console.log("There was an error");
      res.redirect("/");
      res.end();

    } else {
      var newPath = "./app/media/photos/fullsize/" + imageName;

      var thumbPath = "./app/media/photos/thumbs/" + imageName;

      /// write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        /*console.log(err);
        /// write file to uploads/thumbs folder
        im.resize({
          srcPath: newPath,
          dstPath: thumbPath,
          width:   120
        }, function(err, stdout, stderr){
          if (err) throw err;
          console.log('resized image to fit within 200x200px');
        });*/
        res.json({path:"/photos/fullsize/" + imageName});
      });
    }
  });
};

