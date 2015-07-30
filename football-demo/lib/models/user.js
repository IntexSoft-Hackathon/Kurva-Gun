'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    email: {type: String},
    username: {type: String, unique: true, required: true},
    experience: {type: Number, default: 10},
    win: {type: Number, default: 0},
    lost: {type: Number, default: 0},
    count_games: {type: Number, default: 0},
    register_time: {type: Date},
    game_time: {type: Number},
    level: {type: String, default: "Джуниор"},
    achievements: [{name: String, time: Date, description: String, image: String}],
    hashedPassword: String, salt: String, name: String,
    active: {type: Boolean, default: true},
    photo: {type: String, default: "photo.png"},
    play_sound: {type: Boolean, default: false}
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema
    .virtual('user_info')
    .get(function () {
        return {
            '_id': this._id, 'username': this.username, 'email': this.email, 'name': this.name,
            'experience': this.experience, 'win': this.win, 'lost': this.lost, 'count_games': this.count_games,
            'register_time': this.register_time,
            'game_time': this.game_time,
            'level': this.level,
            'achievements': this.achievements,
            'photo': this.photo,
            'play_sound': this.play_sound
        };
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The specified email is invalid.');

UserSchema.path('email').validate(function (value, respond) {
    if (this.isNew) {
        mongoose.models.User.findOne({email: value}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                return respond(false);
            }
            respond(true);
        });
    } else {
        respond(true);
    }
}, 'The specified email address is already in use.');

UserSchema.path('username').validate(function (value, respond) {
    if (this.isNew) {
        mongoose.models.User.findOne({username: value}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                return respond(false);
            }
            respond(true);
        });
    } else {
        respond(true);
    }
}, 'The specified username is already in use.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next();
    }

    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    }
    else {
        next();
    }
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     */

    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     */

    encryptPassword: function (password) {
        if (!password || !this.salt) {
            return '';
        }
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

/**
 * Statics
 */
UserSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('User', UserSchema);
