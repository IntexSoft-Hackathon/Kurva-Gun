'use strict';

var util = require("util"),
    EventEmitter = require('events').EventEmitter,
    GameController = require('../../app.js').gameController,
    UserController = require('../../app.js').userController;

GameController.on(GameController.GAME_END_EVENT, function(game){
    updateUsersStatistic(game);
});

function updateUsersStatistic(game)
{
    //TODO handle STATISTIC FOR ABORTED GAMES. FOR NOW IT'S IGNORED
    if (game.game_status === GameController.STATUS_FINISHED)
    {
        if (game.team_white.players.length != game.team_blue.players.length)
        {
            throw "Invalid game state, different amount of players in teams";
        }
        for (var i = 0; i < game.team_white.players.length; i++) {
            var whitePlayer = game.team_white.players[i];
            var bluePlayer = game.team_blue.players[i];
            console.log("Update players statistic. team_white.score = " + game.team_white.score + ", team_blue.score = " + game.team_blue.score);
            whitePlayer.count_games++;
            bluePlayer.count_games++;
            if (game.team_white.score > game.team_blue.score)
            {
                whitePlayer.win++;
                bluePlayer.lost++;
                whitePlayer.experience += 2;
                //Experience can't be lower that 0
                if (bluePlayer.experience > 0)
                {
                    bluePlayer.experience -= 1;
                }

            }
            else
            {
                bluePlayer.win++;
                whitePlayer.lost++;
                bluePlayer.experience += 2;
                //Experience can't be lower that 0
                if (whitePlayer.experience > 0)
                {
                    whitePlayer.experience -= 1;
                }
            }
            updateUserLevel(whitePlayer);
            updateUserLevel(bluePlayer);
            logUserStatistic(whitePlayer);
            logUserStatistic(bluePlayer);
            //TODO send events on player update?
            whitePlayer.save();
            bluePlayer.save();
        }
    }
}
function logUserStatistic(user) {
    console.log("New player statistic, name = " + user.username +
        ", win = " + user.win + ", lost = " + user.lost +
        ", exp = " + user.experience + ", level = " + user.level);
}

function updateUserLevel(user)
{
    if (user.experience < 5) {
        user.level = "Днище";
    }
    else if (user.experience >=5 && user.experience < 10) {
        user.level = "Сосуля";
    }
    else if (user.experience >=10 && user.experience < 15) {
        user.level = "Джуниор";
    }
    else if (user.experience >=15 && user.experience < 25) {
        user.level = "Любитель";
    }
    else if (user.experience >=25 && user.experience < 35) {
        user.level = "Бывалый";
    }
    else if (user.experience >=35 && user.experience < 35) {
        user.level = "Сеньер";
    }
    else if (user.experience >=45 && user.experience < 55) {
        user.level = "Профи";
    }
    else if (user.experience >=55 && user.experience < 65) {
        user.level = "Красавчик";
    }
    else if (user.experience >=65 && user.experience < 85) {
        user.level = "Стасоподобный";
    }
    else if (user.experience >=85) {
        user.level = "Kurva-Gun";
    }
}
