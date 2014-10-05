'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AchievementSchema = new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    scored_goals: {type:Number, default:0},
    against_goals: {type:Number, default:0}
});

AchievementSchema
    .virtual('game_info')
    .get(function () {
        return {'_id_user': this._id_user, 'id_user': this.id_user, 'scored_goals': this.scored_goals, 'against_goals': this.against_goals};
    });

/**
 * Methods
 */

/**
 * Statics
 */
AchievementSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id_user: id_user
        }).populate('user','name', 'username').exec(cb);
    }
};

mongoose.model('Achievement', AchievementSchema);
