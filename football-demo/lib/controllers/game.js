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
    self. STATUS_ABORTED = "ABORTED";

    self.GAME_START_EVENT = "game:start";
    self.GAME_UPDATE_EVENT = "game:update";
    self.GAME_END_EVENT = "game:end";

    self.NEW_ACHIEVEMENT_EVENT = "game:achievement";

    var currentGame = null;
    updateCurrentGame();

    Arduino.on(Arduino.ARDUINO_GOAL, function(team){
        goal(team);
    });

    Arduino.on(Arduino.ARDUINO_IS_STOPPED, function(stopMessage){
        _stop(currentGame, true);
    });

    self.start = function (req, res) {
        if (isGameReadyToStart(currentGame)) {
            console.log("Start the game");
            Arduino.start();
            currentGame.start_time = currentGame.start_time ? currentGame.start_time : new Date();
            currentGame.game_status = self.STATUS_IN_PROGRESS;
            saveGame(currentGame, function (game) {
                res.json({status: 'OK'});
                io.sockets.emit(self.GAME_START_EVENT, game);
                self.emit(self.GAME_START_EVENT, game);
                console.log("Game is started");
            });
        }
        else {
            var game_status = currentGame ? currentGame.game_status : null;
            console.error("Can't start the game. Current game is invalid state, game_status = " + game_status);
            updateCurrentGame();
            res.send(400, 'INVALID_GAME_STATE');
        }
    };

    self.stop = function (req, res) {
        if (currentGame && currentGame.game_status === self.STATUS_IN_PROGRESS) {
            console.log("Stop the game");
            _stop(currentGame, true);
            res.json({status: 'OK'});
        }
        else {
            var game_status = currentGame ? currentGame.game_status : null;
            console.error("Can't start the game. Current game is invalid state, game_status = " + game_status);
            updateCurrentGame();
        }
    };

    function _stop(game, isAborted) {
        if (game.game_status === self.STATUS_IN_PROGRESS) {
            console.log("Stop the game");
            Arduino.stop();
            game.game_status = isAborted ? self.STATUS_ABORTED : self.STATUS_FINISHED;
            game.end_time = new Date();
            saveGame(game, function (game) {
                findCurrentGame(function (newGame) {
                    if (!isAborted) {
                        var playerWDefend = game.team_white.players[0] ? game.team_white.players[0]._id : null;
                        var playerWAttack = game.team_white.players[1] ? game.team_white.players[1]._id : null;
                        newGame.team_white.players = [playerWDefend, playerWAttack];
                        var playerBDefend = game.team_blue.players[0] ? game.team_blue.players[0]._id : null;
                        var playerBAttack = game.team_blue.players[1] ? game.team_blue.players[1]._id : null;
                        newGame.team_blue.players = [playerBDefend, playerBAttack];
                    }
                    saveGame(newGame, function (game) {
                        io.sockets.emit(self.GAME_UPDATE_EVENT, game);
                    });
                });
                io.sockets.emit(self.GAME_END_EVENT, game);
                self.emit(self.GAME_END_EVENT, game);
            });
        }
        else {
            console.error("Can't stop the game, can't find started game. Ignore stop command");
        }

    }

    function goal(team) {
        if (currentGame && currentGame.game_status == self.STATUS_IN_PROGRESS) {
            console.log("Process goal message in gate = " + team);
            if (team == Arduino.GOAL_WHITE_MESSAGE) {
                currentGame.team_blue.score++;
                currentGame.team_blue.goals.push({time: new Date()});
                console.log("Increment blue team score, new score = " + currentGame.team_blue.score);
                if (currentGame.team_blue.score === 10) {
                    return _stop(currentGame, false);
                }
            } else if (team == Arduino.GOAL_BLUE_MESSAGE) {
                currentGame.team_white.score++;
                currentGame.team_white.goals.push({time: new Date()});
                console.log("Increment white team score, new score = " + currentGame.team_white.score);
                if (currentGame.team_white.score === 10) {
                    return _stop(currentGame, false);
                }
            }
            saveGame(currentGame, function (game) {
                io.sockets.emit(self.GAME_UPDATE_EVENT, game);
                self.emit(self.GAME_UPDATE_EVENT, game);
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
  self.game = function (req, res, next, id) {
    var game = req.game;
    Game.load(id, function (err, game) {
      if (err) {
        return next(err);
      }
      if (!game) {
        return next(new Error('Failed to load game ' + id));
      }
      req.game = game;
      next();
    });
  };

    /**
     * Update a game
     */
  self.update = function (req, res) {
    var game = req.game;
    var updatedGame = req.body;
    game.start_time = updatedGame.start_time;
    game.end_time = updatedGame.end_time;
    game.game_status = updatedGame.game_status;
    var playerWDefend = updatedGame.team_white.players[0] ? updatedGame.team_white.players[0]._id : null;
    var playerWAttack = updatedGame.team_white.players[1] ? updatedGame.team_white.players[1]._id : null;
    game.team_white.players = [playerWDefend, playerWAttack];
    var playerBDefend = updatedGame.team_blue.players[0] ? updatedGame.team_blue.players[0]._id : null;
    var playerBAttack = updatedGame.team_blue.players[1] ? updatedGame.team_blue.players[1]._id : null;
    game.team_blue.players = [playerBDefend, playerBAttack];
      saveGame(game, function(game)
      {
          res.json(game);
      });
  };

    /**
     *  Find All
     *  returns all games
     */
    self.findStartedGame = function (req, res) {
        console.log("Search for started games");
      findCurrentGame(function (game) {
        res.json(game);
        });
    };

    self.findActiveGame = function (func) {
        console.log("Search for active games");
        findCurrentGame(function (game) {
            func(game);
        });
    };

    function saveGame(game, func)
    {
        game.save(function (err, game) {
            Game.populate(game, {path: "team_white.players team_blue.players achievements.user"}, function (err, game) {
                currentGame = game;
                func(game);
            });
        });
    }

    function updateCurrentGame()
    {
        currentGame = null;
        findCurrentGame(function(game){
            currentGame = game;
            io.sockets.emit(self.GAME_UPDATE_EVENT, game);
        });
    }

    function findCurrentGame(func) {
        return Game.findOne({$or: [
            {game_status: self.STATUS_NEW},
            {game_status: self.STATUS_IN_PROGRESS}
        ]}).populate('team_white.players team_blue.players achievements.user').exec(function (err, game) {
            if (!game)
            {
                game = new Game();
                saveGame(game, function(game){
                    func(game);
                });
            }
            else
            {
                func(game);
            }
        });
    }

    function isGameReadyToStart(game) {
        console.log("Check game status = " + game.game_status);
        var result = false;
        if (game && game.game_status == self.STATUS_NEW) {
            console.log("STATUS is valid, check type and players");
            console.log("Game type = " + game.game_type + ", white players = " + game.team_blue.players.length + ", blue players = " + game.team_white.players.length);
            if (game.game_type === "TEAM" && game.team_blue.players.length == 2 && game.team_white.players.length == 2) {
                result = true;
            }
            else if (game.game_type === "SINGLE" && game.team_blue.players.length == 1 && game.team_white.players.length == 1) {
                result = true;
            }
        }
        return result;
    }
};

util.inherits(GameController, EventEmitter);
module.exports = GameController;