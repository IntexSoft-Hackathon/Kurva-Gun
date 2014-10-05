'use strict';

var mongoose = require('mongoose'),
    Arduiono = require('./usbreader.js'),
    Game = mongoose.model('Game'),
    ObjectId = mongoose.Types.ObjectId,
    io = require('../../app.js').io;

/**
 * Start game
 */
exports.start = function (req, res) {
    findCurrentGame().exec(function (err, game) {
        if (err) {
            return next(err);
        }
        Arduiono.startGame();
        game.start_time = new Date();
        game.game_status = "IN_PROGRESS";
        game.save();
        res.json(game);
    });
};

exports.stop = function () {
    var currentGame = findCurrentGame();
    Arduiono.stopGame();
    currentGame.game_status = "FINISHED";
    currentGame.end_time = new Date();
    currentGame.save();
};

exports.goal = function(team) {
    var currentGame = findCurrentGame();
    if (team === Arduiono.GOAL_WHITE_MESSAGE)
    {
        currentGame.team_blue.score++;
        currentGame.team_blue.goals.push(new Date());
        if (currentGame.team_blue.score === 10)
        {
            stop();
        }
    }
    else
    {
        currentGame.team_white.score++;
        currentGame.team_white.goals.push(new Date());
        if (currentGame.team_white.score === 10)
        {
            stop();
        }
    }
    currentGame.save();
    io.sockets.emit("game:update", game);
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
    findCurrentGame().exec(function (err, game) {
        if (err) {
            return next(err);
        }
        if (!game)
        {
            game = new Game();
            game.save();
        }
        res.json(game);
    });
};

function findCurrentGame()
{
    return Game.findOne({$or: [{game_status:"NEW"}, {game_status:"IN_PROGRESS"}]});
}

