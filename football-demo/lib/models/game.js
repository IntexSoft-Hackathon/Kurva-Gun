'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
    start_time: {type:Date, default:0},
    end_time: {type:Date, default:0},
    game_status: {type: String},
    team_white: {players:[{type: mongoose.Schema.ObjectId, ref: 'User', role: String}], score: Number, goals: [{time: Date}]},
    team_blue: {players:[{type: mongoose.Schema.ObjectId, ref: 'User', role: String}], score: Number, goals: [{time: Date}]}
});

GameSchema
    .virtual('game_info')
    .get(function () {
        return {'start_time': this.start_time, 'end_time': this.end_time, 'game_status': this.game_status, 'team_white': this.team_white, 'team_blue': this.team_blue};
    });

/**
 * Methods
 */

/**
 * Statics
 */
//GameSchema.statics = {
//    load: function (id, cb) {
//        this.findOne({
//            _id_user: id_user
//        }).populate('user','name', 'username').exec(cb);
//    }
//};

mongoose.model('Game', GameSchema);
