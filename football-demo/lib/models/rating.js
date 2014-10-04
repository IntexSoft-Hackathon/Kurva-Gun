'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    points: Number,
    win: Number,
    lost: Number,
    count_games: Number
});

RatingSchema
    .virtual('rating_user_info')
    .get(function () {
        return {'_id_user': this._id_user, 'id_user': this.id_user, 'points': this.points, 'win': this.win, 'lost': this.lost, 'count_games': this.count_games};
    });

/**
 * Methods
 */

/**
 * Statics
 */
RatingSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id_user: id_user
        }).populate('user','name', 'username').exec(cb);
    }
};

mongoose.model('Rating', RatingSchema);
