'use strict';

var util = require("util"),
    EventEmitter = require('events').EventEmitter,
    GameController = require('../../app.js').gameController,
    UserController = require('../../app.js').userController;

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
    console.log("Calculate interval achievements");
    GameController.findActiveGame(function (game) {
        if (game && game.game_status === GameController.STATUS_IN_PROGRESS) {
            var minute = 1000 * 60;
            if (new Date().getTime() - game.start_time.getTime() > minute) {
                console.log("Game is running more then one minute");
            }
          if (new Date().getTime() - game.start_time.getTime() > minute * 1) {
                console.log("Game is running more then ten minutes");
                var achievement = {
                    name: String,
                    time: Date,
                    description: String,
                    image: String
                };
                achievement.name = "ПАТИ-ТУХЛЯК";
                achievement.description = "Игра дольше 10 минут";
                achievement.time = new Date();
                achievement.image = "achievements/party_sucks.PNG";
                for (var i = 0; i < game.team_white.players.length; i++) {
                    var whitePlayer = game.team_white.players[i];
                    var bluePlayer = game.team_blue.players[i];
                    var whitePlayerAchievementExist = isAchievementExist(whitePlayer, achievement);
                    var bluePlayerAchievementExist = isAchievementExist(bluePlayer, achievement);
                    if (!whitePlayerAchievementExist) {
                        whitePlayer.achievements.push(achievement);
                        GameController.emit(GameController.NEW_ACHIEVEMENT_EVENT, whitePlayer, achievement);
                    }
                    if (!bluePlayerAchievementExist) {
                        bluePlayer.achievements.push(achievement);
                        GameController.emit(GameController.NEW_ACHIEVEMENT_EVENT, bluePlayer, achievement);
                    }
                    if (!whitePlayerAchievementExist) {
                        achievement.user = whitePlayer;
                        game.achievements.push(achievement);
                    }
                    if (!bluePlayerAchievementExist) {
                        achievement.user = bluePlayer;
                        game.achievements.push(achievement);
                    }
                }
            }
            var lastGoalTime = getLastGoalTime(game);
            if (lastGoalTime && (new Date().getTime() - lastGoalTime > minute)) {
                console.log("More then one minute left since last goal");
            }
        }
    });
}

function isAchievementExist(user, newAchievement) {
    var result = false;
    for (var i = 0; i < user.achievements.length; i++) {
        var achievement = user.achievements[i];
        if (newAchievement.name === achievement.name) {
            result = true;
            break;
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
setInterval(checkTimedAchievements, 1000 * 30);