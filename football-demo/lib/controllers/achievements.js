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
    GameController.findActiveGame(function(game){
        if (game)
        {
            var minute = 1000 * 60;
            if (new Date().getTime() - game.start_time.getTime() > minute)
            {
                console.log("Game is running more then one minute");
            }
            if (new Date().getTime() - game.start_time.getTime() > minute * 5)
            {
                console.log("Game is running more then five minutes");
            }
            var lastGoalTime = getLastGoalTime(game);
            if (lastGoalTime && (new Date().getTime() -  lastGoalTime > minute))
            {
                console.log("More then one minute left since last goal");
            }
        }
    });
}

function getLastGoalTime(game)
{
    var lastGoalTime = null;
    if (game.team_blue.goals.length > 0 )
    {
        lastGoalTime = game.team_blue.goals[game.team_blue.goals.length - 1].time.getTime();
    }
    if (game.team_white.goals.length > 0 )
    {
        var lastWhiteGoalTime = game.team_white.goals[game.team_white.goals.length - 1].time.getTime();
        lastGoalTime = lastGoalTime > lastWhiteGoalTime ? lastGoalTime : lastWhiteGoalTime;
    }
    return lastGoalTime;
}
setInterval(checkTimedAchievements, 1000 * 30);