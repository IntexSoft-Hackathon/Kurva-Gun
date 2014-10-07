'use strict';

var mongoose = require('mongoose'),
    Arduino = require('../../app.js').arduino,
    Game = mongoose.model('Game'),
    ObjectId = mongoose.Types.ObjectId,
    io = require('../../app.js').io;

var GOAL_WHITE_MESSAGE = "GOAL:WHITE";
var GOAL_BLUE_MESSAGE = "GOAL:BLUE";

var STATUS_NEW = "NEW";
var STATUS_IN_PROGRESS = "IN_PROGRESS";
var STATUS_FINISHED = "FINISHED";

var GAME_START_EVENT = "game:start";
var GAME_UPDATE_EVENT = "game:update";
var GAME_END_EVENT = "game:end";

var currentGame = null;
updateCurrentGame();

Arduino.on('game:goal', function(team){
  goal(team);
});

/**
 * Start game
 */
exports.start = function (req, res) {
    if (currentGame && currentGame.game_status === STATUS_NEW)
    {
        console.log("Start the game");
        Arduino.start();
        currentGame.start_time = currentGame.start_time ? currentGame.start_time : new Date();
        currentGame.game_status = STATUS_IN_PROGRESS;
        currentGame.save(function(error, game){
            currentGame = game;
            res.json({status:'OK'});
            io.sockets.emit(GAME_START_EVENT, currentGame);
            io.sockets.emit(GAME_UPDATE_EVENT, currentGame);
            console.log("Game is started");
        });
    }
    else
    {
        var game_status = currentGame ? currentGame.game_status : null;
        console.error("Can't start the game. Current game is invalid state, game_status = " + game_status);
        updateCurrentGame();
    }
};

function stop(game) {
    console.log("Stop the game");
    Arduino.stop();
    game.game_status = STATUS_FINISHED;
    game.end_time = new Date();
    game.save(function (err, game) {
        io.sockets.emit(GAME_UPDATE_EVENT, game);
        io.sockets.emit(GAME_END_EVENT, game);
        updateCurrentGame();
    });
}

function goal(team) {
    if (currentGame && currentGame.game_status == STATUS_IN_PROGRESS) {
        console.log("Process goal message in gate = " + team);
        if (team == GOAL_WHITE_MESSAGE) {
            currentGame.team_blue.score++;
            currentGame.team_blue.goals.push({time: new Date()});
            console.log("Increment blue team score, new score = " + currentGame.team_blue.score);
            if (currentGame.team_blue.score === 10) {
                return stop(currentGame);
            }
        } else if (team == GOAL_BLUE_MESSAGE) {
            currentGame.team_white.score++;
            currentGame.team_white.goals.push({time: new Date()});
            console.log("Increment white team score, new score = " + currentGame.team_white.score);
            if (currentGame.team_white.score === 10) {
                return stop(currentGame);
            }
        }
        currentGame.save(function (err, game) {
            currentGame = game;
            console.log("Send update game event = " + game);
            io.sockets.emit(GAME_UPDATE_EVENT, game);
        });
    }
    else {
        var game_status = currentGame ? currentGame.game_status : null;
        console.error("Can't process goal message. Current game is invalid state, game_status = " + game_status);
        updateCurrentGame();
    }
}

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
            res.json(game);
        }
    });
};

/**
 *  Find All
 *  returns all games
 */
exports.findStartedGame = function (req, res) {
  console.log("Search for started games");
  Game.findOne({game_status:STATUS_IN_PROGRESS}).exec(function(err, game){
    if (!game || err) {
      res.json({})
    }
    res.json(game);
  });
};

function updateCurrentGame()
{
    currentGame = null;
    findCurrentGame(function(game){
        currentGame = game;
    });
}

function findCurrentGame(func) {
    return Game.findOne({$or: [
        {game_status: STATUS_NEW},
        {game_status: STATUS_IN_PROGRESS}
    ]}).exec(function (err, game) {
        if (!game)
        {
            game = new Game();
            game.save(function(err, game){
                func(game);
            });
        }
        else
        {
            func(game);
        }
    });
}