'use strict';

var mongoose = require('mongoose'),
    Arduino = require('../../app.js').arduino,
    Game = mongoose.model('Game'),
    ObjectId = mongoose.Types.ObjectId,
    io = require('../../app.js').io;

var GOAL_WHITE_MESSAGE = "GOAL:WHITE";
var GOAL_BLUE_MESSAGE = "GOAL:BLUE";

var currentGame;

Arduino.on('game:goal', function(team){
  goal(team);
});

/**
 * Start game
 */
exports.start = function (req, res) {
    var game = currentGame ? currentGame : new Game();
    game.save(function(err, game){
      currentGame = game;
      Arduino.start();
      currentGame.start_time = currentGame.start_time ? currentGame.start_time : new Date();
      currentGame.game_status = "IN_PROGRESS";
      currentGame.save(function(error, currentGame){
        res.json({status:'OK'});
        io.sockets.emit("game:update", currentGame);
      });
    });
};

function stop() {
      Arduino.stop();
      currentGame.game_status = "FINISHED";
      currentGame.end_time = new Date();
      currentGame.save(function (err, currentGame) {
        io.sockets.emit("game:update", currentGame);
        io.sockets.emit("game:end", currentGame);
      });
      currentGame = null;
};

function goal(team) {
  if (currentGame) {
    if (team == GOAL_WHITE_MESSAGE) {
      currentGame.team_blue.score++;
      currentGame.team_blue.goals.push({time: new Date()});
      if (currentGame.team_blue.score === 10) {
        return stop(currentGame);
      }
    } else if (team == GOAL_BLUE_MESSAGE) {
      currentGame.team_white.score++;
      currentGame.team_white.goals.push(new Date());
      if (currentGame.team_white.score === 10) {
        return stop(currentGame);
      }
    }
    currentGame.save(function (err, currentGame) {
      io.sockets.emit("game:update", currentGame);
    });
  }
};

/**
 *  Show profile
 */
exports.show = function (req, res, next) {
    var gameIdUser = req.params.gameIdUser;

    Game.findById(ObjectId(gameIdUser), function (err, game) {
        if (err) {
            return next(new Error('Failed to load Game'));
        }
        if (game) {
            res.send({id_user: game.id_user, start_time: game.start_time, end_time: game.end_time});
        } else {
            res.send(404, 'GAME_NOT_FOUND');
        }
    });
};

/**
 * Update a game
 */
exports.update = function (req, res) {
    var game = req.game;
    game.start_time = req.body.start_time;
    game.end_time = req.body.end_time;
    game.game_status = req.body.game_status;
    game.team_white = req.body.team_white;
    game.team_blue = req.body.team_blue;
    game.save(function (err) {
        if (err) {
            res.json(500, err);
        } else {
            //io.sockets.broadcast("game:update", game);
            res.json(game);
        }
    });
};

/**
 *  Find All
 *  returns all games
 */
exports.find = function (req, res, next) {
  Game.findOne({game_status:"IN_PROGRESS"}).exec(function(err, game){
    if (!game || err) {
      res.json({})
    }
    res.json(game);
  });
};

