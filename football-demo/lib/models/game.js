'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    start_time: {type:Date, default:0},
    end_time: {type:Date, default:0}
});

GameSchema
    .virtual('game_info')
    .get(function () {
        return {'_id_user': this._id_user, 'id_user': this.id_user, 'start_time': this.start_time, 'end_time': this.end_time};
    });

/**
 * Methods
 */

/**
 * Statics
 */
GameSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id_user: id_user
        }).populate('user','name', 'username').exec(cb);
    }
};

mongoose.model('Game', GameSchema);
