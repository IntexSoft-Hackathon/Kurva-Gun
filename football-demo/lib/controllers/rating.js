'use strict';

var mongoose = require('mongoose'),
    Rating = mongoose.model('Rating'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Find Rating by id
 */
exports.rating = function (req, res, next, id) {
    Rating.load(id, function (err, rating) {
        if (err) {
            return next(err);
        }
        if (!rating) {
            return next(new Error('Failed to load checklist ' + id));
        }
        req.rating = rating;
        next();
    });
};

/**
 * Create rating
 * requires: {ratingname, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
    var rating = new Rating(req.body);

    rating.save(function (err) {
        if (err) {
            return res.json(400, err);
        }

        res.json(rating.rating_user_info);
    });
};

/**
 *  Show profile
 *  returns {ratingname, profile}
 */
exports.show = function (req, res, next) {
    var ratingIdUser = req.params.ratingIdUser;

    Rating.findById(ObjectId(ratingIdUser), function (err, rating) {
        if (err) {
            return next(new Error('Failed to load Rating'));
        }
        if (rating) {
            res.send({id_user: rating.id_user, points: rating.points, win: rating.win, lost: rating.lost, count_games: rating.count_games});
        } else {
            res.send(404, 'RATING_NOT_FOUND');
        }
    });
};

/**
 * Update a rating
 */
exports.update = function (req, res) {
    var rating = req.rating;
    rating.id_user = req.body.id_user;
    rating.points = req.body.points;
    rating.win = req.body.win;
    rating.lost = req.body.lost;
    rating.count_games = req.body.count_games;
    rating.points = req.body.points;
    rating.save(function (err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(rating);
        }
    });
};

/**
 *  Find All
 *  returns all ratings
 */
exports.find = function (req, res, next) {
    Rating.find({}).exec(function (err, ratings) {
        if (err) {
            return next(new Error('Failed to load Rating'));
        }
        res.json(ratings);
    });
};

