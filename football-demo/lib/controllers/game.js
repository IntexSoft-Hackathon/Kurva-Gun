'use strict';

var mongoose = require('mongoose'),
    Game = mongoose.model('Game'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Find Game by id
 */
exports.game = function (req, res, next, id) {
    Game.load(id, function (err, game) {
        if (err) {
            return next(err);
        }
        if (!game) {
            return next(new Error('Failed to load checklist ' + id));
        }
        req.game = game;
        next();
    });
};

/**
 * Create game
 */
exports.create = function (req, res, next, id) {
    var game = new Game({user:id});

    game.save(function (err) {
        if (err) {
            throw err;
        }
    });
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
            res.json(game);
        }
    });
};

/**
 *  Find All
 *  returns all games
 */
exports.find = function (req, res, next) {
    Game.find({}).populate('user').exec(function (err, games) {
        if (err) {
            return next(new Error('Failed to load Game'));
        }
        res.json(games);
    });
};

