'use strict';

var mongoose = require('mongoose'),
    Arduino = require('../../app.js').arduino,
    Game = mongoose.model('Game'),
    ObjectId = mongoose.Types.ObjectId,
    io = require('../../app.js').io,
    util = require("util"),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var GameController = function() {
    var self=this;
    self.STATUS_NEW = "NEW";
    self.STATUS_IN_PROGRESS = "IN_PROGRESS";
    self.STATUS_FINISHED = "FINISHED";
    self.STATUS_ABORTED = "ABORTED";

    self.GAME_START_EVENT = "game:start";
    self.GAME_UPDATE_EVENT = "game:update";
    self.GAME_END_EVENT = "game:end";

    self.QUEUE_UPDATE_EVENT = "queue:update";

    self.NEW_ACHIEVEMENT_EVENT = "game:achievement";
    self.END_GAME_ACHIEVEMENTS_CALCULATED = "game:end:achievement";

    self.TEAM_WHITE = "WHITE";
    self.TEAM_BLUE = "BLUE";
    self.SECOND = 1000;

    var currentGame = null;

    var currentQueue = [{attack: null, defend: null}, {attack: null, defend: null}, {attack: null, defend: null}];
    updateCurrentGame();

    Arduino.on(Arduino.ARDUINO_GOAL, function(team){
        goal(team);
    });

    Arduino.on(Arduino.ARDUINO_IS_STOPPED, function () {
        _stop(currentGame, true);
    });

  self.on(self.NEW_ACHIEVEMENT_EVENT, function (user, achievement) {
    console.log("Send Notification to Front End");
    io.sockets.emit(self.NEW_ACHIEVEMENT_EVENT, user, achievement);
  });

    self.on(self.END_GAME_ACHIEVEMENTS_CALCULATED, function (game) {
        console.log("Send end game achievements notification to Front End");
        io.sockets.emit(self.END_GAME_ACHIEVEMENTS_CALCULATED, game);
    });

    self.start = function (req, res) {
        if (isGameReadyToStart(currentGame)) {
            console.log("Start the game");
            Arduino.start();
            currentGame.start_time = currentGame.start_time ? currentGame.start_time : new Date();
            currentGame.game_status = self.STATUS_IN_PROGRESS;
            self.saveGame(currentGame, function (game) {
                res.json({status: 'OK'});
                io.sockets.emit(self.GAME_START_EVENT, game);
                self.emit(self.GAME_START_EVENT, game);
                console.log("Game is started");
            });
        }
        else {
            var game_status = currentGame ? currentGame.game_status : null;
            console.error("Can't start the game. Current game is invalid state, game_status = " + game_status);
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
          console.error("Can't stop the game. Current game is invalid state, game_status = " + game_status);
          res.json({status: 'OK'});
        }
    };

    function _stop(game, isAborted) {
        if (game.game_status === self.STATUS_IN_PROGRESS) {
            console.log("Stop the game");
            Arduino.stop();
            game.game_status = isAborted ? self.STATUS_ABORTED : self.STATUS_FINISHED;
            game.end_time = new Date();
            self.saveGame(game, function (game) {
                currentGame = null;
                var playerWDefend, playerWAttack, playerBDefend, playerBAttack, queuePlayers;
                playerWDefend = game.team_white.players[0] ? game.team_white.players[0]._id : null;
                playerWAttack = game.team_white.players[1] ? game.team_white.players[1]._id : null;
                playerBDefend = game.team_blue.players[0] ? game.team_blue.players[0]._id : null;
                playerBAttack = game.team_blue.players[1] ? game.team_blue.players[1]._id : null;
                queuePlayers = currentQueue.shift();
                if (queuePlayers.attack || queuePlayers.defend) {
                    if (game.team_white.score === 10) {
                        playerBDefend = queuePlayers.attack;
                        playerBAttack = queuePlayers.defend;
                    } else {
                        playerWDefend = queuePlayers.attack;
                        playerWAttack = queuePlayers.defend;
                    }
                }
                currentQueue.push({attack: null, defend: null});
                io.sockets.emit(self.QUEUE_UPDATE_EVENT, currentQueue);
                findCurrentGame(function (newGame) {
                    if (!isAborted) {
                      console.log('Set prev players to new game');
                        newGame.team_white.players = [playerWDefend, playerWAttack];
                        newGame.team_blue.players = [playerBDefend, playerBAttack];
                    }
                    self.saveGame(newGame, function (game) {
                      console.log('Send New Game after previous is end.');
                        io.sockets.emit(self.GAME_UPDATE_EVENT, game);
                    });
                });
                self.emit(self.GAME_END_EVENT, game);
                self.emit(self.GAME_UPDATE_EVENT, game);
            });
        }
        else {
            console.error("Can't stop the game, can't find started game. Ignore stop command");
        }

    }

    function goal(team) {
        if (currentGame && currentGame.game_status === self.STATUS_IN_PROGRESS) {
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
            self.saveGame(currentGame, function (game) {
                io.sockets.emit(self.GAME_UPDATE_EVENT, game);
                self.emit(self.GAME_UPDATE_EVENT, game);
            });
        }
        else {
            var game_status = currentGame ? currentGame.game_status : null;
            console.error("Can't process goal message. Current game is invalid state, game_status = " + game_status);
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
      self.saveGame(game, function(game)
      {
        io.sockets.emit(self.GAME_UPDATE_EVENT, game);
          res.json(game);
      });
  };

    self.updateQueue = function (req, res) {
        currentQueue = req.body;
        io.sockets.emit(self.QUEUE_UPDATE_EVENT, currentQueue);
        res.json(currentQueue);
    };

    self.queue = function (req, res) {
        res.json(currentQueue);
    };

    /**
     *  Find Current Game
     *  @return Game
     */
    self.findStartedGame = function (req, res) {
        console.log("Search for started games");
      findCurrentGame(function (game) {
        res.json(game);
        });
    };


    /**
     * Callback active game
     *
     * @param func
     * @callback Game
     */
    self.findActiveGame = function (func) {
        findCurrentGame(function (game) {
            func(game);
        });
    };


    /**
     * Callback game, after saving it and update currentGame
     *
     * @param gameToSave
     * @param func
     * @callback Game
     */
    self.saveGame = function(gameToSave, func)
    {
        gameToSave.save(function (err, savedGame) {
          if (err) {
            console.log(err);
          } else {
            var cashedGame = JSON.parse(JSON.stringify(savedGame));
            Game.populate(savedGame, {path: "team_white.players team_blue.players"}, function (err, populatedGame) {
              if (err || populatedGame == undefined) {
                console.log("error during save = " + err);
                }
              else if (populatedGame.game_status === self.STATUS_NEW || populatedGame.game_status === self.STATUS_IN_PROGRESS) {
                currentGame = populatedGame;
                }
              if (cashedGame.team_white.players[0] == null && populatedGame.team_white.players[0]) {
                populatedGame.team_white.players[1] = populatedGame.team_white.players[0];
                populatedGame.team_white.players[0] = null;
              }
              if (cashedGame.team_blue.players[0] == null && populatedGame.team_blue.players[0]) {
                populatedGame.team_blue.players[1] = populatedGame.team_blue.players[0];
                populatedGame.team_blue.players[0] = null;
              }
                func(populatedGame);
            });
          }
        });
    };

    /**
     * Update currentGame
     *
     */
    function updateCurrentGame()
    {
        currentGame = null;
        findCurrentGame(function(game){
            currentGame = game;
            io.sockets.emit(self.GAME_UPDATE_EVENT, game);
        });
    }

    /**
     * Callback game, if game not exist then create it.
     *
     * @param func
     * @callback game
     */
    function findCurrentGame(func) {
        return Game.findOne({$or: [
            {game_status: self.STATUS_NEW},
            {game_status: self.STATUS_IN_PROGRESS}
        ]}).populate('team_white.players team_blue.players').exec(function (err, game) {
            if (!game)
            {
                if (!currentGame)
                {
                    game = new Game();
                    game.create_time = new Date();
                    currentGame = game;
                    self.saveGame(game, function(game){
                        func(game);
                    });
                }
                else
                {
                    func(currentGame)
                }
            }
            else
            {
                func(game);
            }
        });
    }

    /**
     * Return true, if game can be start, otherwise return false
     *
     * @param game
     * @return Boolean
     */
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

    /**
     * Checks game status and clean up players, if necessary
     *
     */
    function checkGameStatus() {
        findCurrentGame(function (game) {
            if (game && game.game_status == self.STATUS_NEW) {
                if (new Date().getTime() - game.create_time.getTime() > self.SECOND * 60 * 5) {
                    console.log('Clean up players from NEW game, after 5 minutes of inactive');
                    game.team_blue.players = [];
                    game.team_white.players = [];
                    game.create_time = new Date();
                    self.saveGame(game, function () {
                        io.sockets.emit(self.GAME_UPDATE_EVENT, game);
                    });
                }
            }
        });
    }

    setInterval(checkGameStatus, self.SECOND * 60 * 5);
};

util.inherits(GameController, EventEmitter);
module.exports = GameController;