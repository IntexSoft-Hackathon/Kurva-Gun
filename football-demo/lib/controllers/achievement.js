'use strict';

var mongoose = require('mongoose'),
    Achievement = mongoose.model('Achievement'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Find Achievement by id
 */
exports.achievement = function (req, res, next, id) {
    Achievement.load(id, function (err, achievement) {
        if (err) {
            return next(err);
        }
        if (!achievement) {
            return next(new Error('Failed to load checklist ' + id));
        }
        req.achievement = achievement;
        next();
    });
};

/**
 * Create achievement
 */
exports.create = function (req, res, next, id) {
    var achievement = new Achievement({user:id});

    achievement.save(function (err) {
        if (err) {
            throw err;
        }
    });
};

/**
 *  Show profile
 */
exports.show = function (req, res, next) {
    var achievementIdUser = req.params.achievementIdUser;

    Achievement.findById(ObjectId(achievementIdUser), function (err, achievement) {
        if (err) {
            return next(new Error('Failed to load Achievement'));
        }
        if (achievement) {
            res.send({id_user: achievement.id_user, scored_goals: achievement.scored_goals, against_goals: achievement.against_goals});
        } else {
            res.send(404, 'RATING_NOT_FOUND');
        }
    });
};

/**
 * Update a achievement
 */
exports.update = function (req, res) {
    var achievement = req.achievement;
    achievement.id_user = req.body.id_user;
    achievement.scored_goals = req.body.scored_goals;
    achievement.against_goals = req.body.against_goals;
    achievement.save(function (err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(achievement);
        }
    });
};

/**
 *  Find All
 *  returns all achievements
 */
exports.find = function (req, res, next) {
    Achievement.find({}).populate('user').exec(function (err, achievements) {
        if (err) {
            return next(new Error('Failed to load Achievement'));
        }
        res.json(achievements);
    });
};

