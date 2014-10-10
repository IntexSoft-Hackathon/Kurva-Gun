'use strict';

var util = require("util"),
    EventEmitter = require('events').EventEmitter,
    GameController = require('../../app.js').gameController,
    UserController = require('../../app.js').userController,
    AchievementsCollection = require('../../app.js').achievementsCollection;

setInterval(checkTimedAchievements, 1000);

GameController.on(GameController.GAME_START_EVENT, function (game) {
    console.log("Calculate game start achievements");
});

GameController.on(GameController.GAME_UPDATE_EVENT, function (game) {
    console.log("Calculate game update achievements");
});

GameController.on(GameController.GAME_END_EVENT, function (game) {
    console.log("Calculate end game achievements");
});

function checkTimedAchievements() {
    GameController.findActiveGame(function (game) {
        if (game && game.game_status === GameController.STATUS_IN_PROGRESS) {
            var minute = 1000 * 60;
            if (new Date().getTime() - game.start_time.getTime() > minute * 1) {
                console.log("Game is running more then ten minutes");

                var achievement = AchievementsCollection.ACHIEVEMENT_PARTY_SUCKS;
                achievement.time = new Date();

                iterateAllPlayers(game, function(player){
                    //console.log("iterate player = " + player.username);
                    game = addAchievement(achievement, player, game);
                    return game;
                }, function(game){
                    GameController.saveGame(game, function () {
                    });
                });
            }
            var lastGoalTime = getLastGoalTime(game);
            if (lastGoalTime && (new Date().getTime() - lastGoalTime > minute)) {
                console.log("More then one minute left since last goal");
            }
        }
    });
}

function iterateAllPlayers(game, processNextPlayer, afterIteration)
{
    for (var i = 0; i < game.team_white.players.length; i++) {
        var whitePlayer = game.team_white.players[i];
        game = processNextPlayer(whitePlayer);
        var bluePlayer = game.team_blue.players[i];
        game = processNextPlayer(bluePlayer);
    }
    afterIteration(game);
}

function addAchievement(achievement, player, game) {
    //console.log("Add achievement name = " + name + ", descr = " + description + ", player = " + player + ", game =" + game);
    //Check if user already have this achievement
    var exist = isAchievementExist(player, achievement);
    if (!exist) {
        player.achievements.push(achievement);
        achievement.user = player;
        game.achievements.push(achievement);
        UserController.saveUser(player, function (err, user) {
            GameController.emit(GameController.NEW_ACHIEVEMENT_EVENT, user, achievement);
        });
    }
    return game;
}

function isAchievementExist(user, newAchievement) {
    for (var i = 0; i < user.achievements.length; i++) {
        var achievement = user.achievements[i];
        //console.log("New achievement name = " + newAchievement.name + ", existing achievement = " + achievement.name);
        if (newAchievement.name === achievement.name) {
            return true;
        }
    }
}

function getLastGoalTime(game) {
    var lastGoalTime = null;
    if (game.team_blue.goals.length > 0) {
        lastGoalTime = game.team_blue.goals[game.team_blue.goals.length - 1].time.getTime();
    }
    if (game.team_white.goals.length > 0) {
        var lastWhiteGoalTime = game.team_white.goals[game.team_white.goals.length - 1].time.getTime();
        lastGoalTime = lastGoalTime > lastWhiteGoalTime ? lastGoalTime : lastWhiteGoalTime;
    }
    return lastGoalTime;
}