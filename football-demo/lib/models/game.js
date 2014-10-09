'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
    start_time: {type:Date},
    end_time: {type:Date},
    //NEW, IN_PROGRESS, FINISHED, ABORTED
    game_status: {type: String, default: "NEW"},
    //SINGLE, TEAM
    game_type: {type: String, default: "TEAM"},
    team_white: {players:[{type: mongoose.Schema.ObjectId, ref: 'User', role: String}], score: {type:Number, default:0}, goals: [{time: Date}]},
    team_blue: {players:[{type: mongoose.Schema.ObjectId, ref: 'User', role: String}], score: {type:Number, default:0}, goals: [{time: Date}]}
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
GameSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('Game', GameSchema);
