'use strict';

var mongoose = require('mongoose'),
    Arduino = require('../../app.js').arduino,
    Game = mongoose.model('Game'),
    ObjectId = mongoose.Types.ObjectId,
    io = require('../../app.js').io,
    util = require("util"),
    EventEmitter = require('events').EventEmitter;

var GameController = function() {
    var self=this;

    self.STATUS_NEW = "NEW";
    self.STATUS_IN_PROGRESS = "IN_PROGRESS";
    self. STATUS_FINISHED = "FINISHED";

    self.GAME_START_EVENT = "game:start";
    self.GAME_UPDATE_EVENT = "game:update";
    self.GAME_END_EVENT = "game:end";

    var currentGame = null;
    updateCurrentGame();

    Arduino.on(Arduino.ARDUINO_GOAL, function(team){
        goal(team);
    });

    self.start = function (req, res) {
        if (currentGame && currentGame.game_status === self.STATUS_NEW) {
            console.log("Start the game");
            Arduino.start();
            currentGame.start_time = currentGame.start_time ? currentGame.start_time : new Date();
            currentGame.game_status = self.STATUS_IN_PROGRESS;
            currentGame.save(function (error, game) {
                currentGame = game;
                res.json({status: 'OK'});
                io.sockets.emit(self.GAME_START_EVENT, currentGame);
                self.emit(self.GAME_START_EVENT, currentGame);
                console.log("Game is started");
            });
        }
        else {
            var game_status = currentGame ? currentGame.game_status : null;
            console.error("Can't start the game. Current game is invalid state, game_status = " + game_status);
            updateCurrentGame();
        }
    };

    function stop(game) {
        console.log("Stop the game");
        Arduino.stop();
        game.game_status = self.STATUS_FINISHED;
        game.end_time = new Date();
        game.save(function (err, game) {
            io.sockets.emit(self.GAME_END_EVENT, game);
            self.emit(self.GAME_END_EVENT, currentGame);
            updateCurrentGame();
        });
    }

    function goal(team) {
        if (currentGame && currentGame.game_status == self.STATUS_IN_PROGRESS) {
            console.log("Process goal message in gate = " + team);
            if (team == Arduino.GOAL_WHITE_MESSAGE) {
                currentGame.team_blue.score++;
                currentGame.team_blue.goals.push({time: new Date()});
                console.log("Increment blue team score, new score = " + currentGame.team_blue.score);
                if (currentGame.team_blue.score === 10) {
                    return stop(currentGame);
                }
            } else if (team == Arduino.GOAL_BLUE_MESSAGE) {
                currentGame.team_white.score++;
                currentGame.team_white.goals.push({time: new Date()});
                console.log("Increment white team score, new score = " + currentGame.team_white.score);
                if (currentGame.team_white.score === 10) {
                    return stop(currentGame);
                }
            }
            currentGame.save(function (err, game) {
                currentGame = game;
                //console.log("Send update game event = " + game);
                io.sockets.emit(self.GAME_UPDATE_EVENT, game);
                self.emit(self.GAME_UPDATE_EVENT, currentGame);
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
    self.show = function (req, res, next) {
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
    self.update = function (req, res) {
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
    self.findStartedGame = function (req, res) {
        console.log("Search for started games");
        Game.findOne({game_status:self.STATUS_IN_PROGRESS}).exec(function(err, game){
            if (!game || err) {
                res.json({})
            }
            res.json(game);
        });
    };

    self.findActiveGame = function (func) {
        console.log("Search for active games");
        Game.findOne({game_status:self.STATUS_IN_PROGRESS}).exec(function(err, game){
            if (!game || err) {
                game = null;
            }
            func(game);
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
            {game_status: self.STATUS_NEW},
            {game_status: self.STATUS_IN_PROGRESS}
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
};

util.inherits(GameController, EventEmitter);
module.exports = GameController;