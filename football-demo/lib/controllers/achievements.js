'use strict';

var mongoose = require('mongoose'),
    util = require("util"),
    EventEmitter = require('events').EventEmitter,
    GameController = require('../../app.js').gameController,
    UserController = require('../../app.js').userController,
    AchievementsCollection = require('../../app.js').achievementsCollection,
    User = mongoose.model('User'),
    Game = mongoose.model('Game'),
    Q = require('q'),
    deferred = Q.defer();

setInterval(checkTimedAchievements, 1000);

var TEAMS = ["team_blue", "team_white"];
var TEAM_COUNT = 2;

GameController.on(GameController.GAME_START_EVENT, function () {
    console.log("Calculate game start achievements");
});

GameController.on(GameController.GAME_UPDATE_EVENT, function (updatedGame) {
    console.log("Calculate game update achievements");

    updatedGame = calculateGoalSeries(updatedGame);
    updatedGame = calculateBolt(updatedGame);
    updatedGame = calculateBeast(updatedGame);
    updatedGame = calculateGunner(updatedGame);
    iterateAllPlayers(updatedGame, function (player) {
        updatedGame = calculateGoalsCountAchievements(player, updatedGame);
    }, function () {
        GameController.saveGame(updatedGame, function (game) {
            console.log("Saved game after game update event");
        });

    });
});

GameController.on(GameController.GAME_END_EVENT, function (endedGame) {
    console.log(endedGame);
    console.log("Calculate end game achievements");
    if (endedGame && endedGame.game_status === GameController.STATUS_FINISHED) {
        iterateAllPlayers(endedGame, function (player, team) {
            //Calculate data for ACHIEVEMENT_IMPUDENT, ACHIEVEMENT_WOW, ACHIEVEMENT_JEWELER
            endedGame = calculateCleanSheetsVictories(player, endedGame);
            //Calculate data for ACHIEVEMENT_BULLET, ACHIEVEMENT_ROCK, ACHIEVEMENT_ROCK_BULLET
            endedGame = calculateTotalVictoriesAchievements(player, endedGame);
            endedGame = calculateGoldenGoalAchievement(player, endedGame, team);
            endedGame = calculateDrinkPoisonAchievement(player, endedGame, team);
            endedGame = calculatePerfectWeekAchievement(player, endedGame, team);
        }, function () {
            console.log("add achievements to game after game ended");
            GameController.saveGame(endedGame, function (game) {
                endedGame = calculateWeAreBeautiful(endedGame);
                endedGame = calculateWall(endedGame);
                endedGame = calculateFlash(endedGame);
                endedGame = calculateBatman(endedGame);
                //console.log("Saved game after game end event = " + game);
                GameController.emit(GameController.END_GAME_ACHIEVEMENTS_CALCULATED, game);
            });
        });
    }
});

function checkTimedAchievements() {
    GameController.findActiveGame(function (game) {
        if (game && game.game_status === GameController.STATUS_IN_PROGRESS) {
            var minute = 1000 * 60;
            if (new Date().getTime() - game.start_time.getTime() > minute * 10) {
                //console.log("Game is running more then ten minutes");

                var achievement = AchievementsCollection.ACHIEVEMENT_PARTY_SUCKS;
                achievement.time = new Date();

                iterateAllPlayers(game, function (player) {
                    //console.log("iterate player = " + player.username);
                    game = addAchievement(achievement, player, game);
                }, function () {
                    GameController.saveGame(game, function () {
                    });
                });
            }
            var lastGoalTime = getLastGoalTime(game);
            if (lastGoalTime && (new Date().getTime() - lastGoalTime > minute)) {
                //console.log("More then one minute left since last goal");
            }
        }
    });
}

function iterateAllPlayers(game, processNextPlayer, afterIteration) {
    for (var i = 0; i < game.team_white.players.length; i++) {
        var whitePlayer = game.team_white.players[i];
        processNextPlayer(whitePlayer, GameController.TEAM_WHITE);
        var bluePlayer = game.team_blue.players[i];
        processNextPlayer(bluePlayer, GameController.TEAM_BLUE);
    }
    afterIteration();
}

function addAchievement(achievement, player, game) {
    //console.log("Add achievement name = " + name + ", descr = " + description + ", player = " + player + ", game =" + game);
    //Check if user already have this achievement
    var exist = isAchievementExist(player, achievement);
    if (!exist) {
        player.achievements.push(achievement);
        achievement.user = player.username;
        game.achievements.push(achievement);
        UserController.saveUser(player, function (err, user) {
            GameController.emit(GameController.NEW_ACHIEVEMENT_EVENT, user, achievement);
        });
    }
    return game;
}

function isAchievementExist(player, newAchievement) {
    for (var i = 0; i < player.achievements.length; i++) {
        var achievement = player.achievements[i];
        //console.log("New achievement name = " + newAchievement.name + ", existing achievement = " + achievement.name);
        if (newAchievement.name === achievement.name) {
            return true;
        }
    }
    return false;
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

function calculateGoalsCountAchievements(player, game) {
    Game.find({
        $or: [
            {'team_white.players': player._id},
            {'team_blue.players': player._id}
        ]
    }).exec(function (err, games) {
        var goalsCount = 0;
        for (var i = 0; i < games.length; i++) {
            var nextGame = games[i];
            for (var j = 0; j < nextGame.team_white.players.length; j++) {
                var whitePlayer = game.team_white.players[j];
                if (whitePlayer === player._id) {
                    goalsCount += nextGame.team_white.score;
                }
                var bluePlayer = game.team_blue.players[j];
                if (bluePlayer === player._id) {
                    goalsCount += nextGame.team_blue.score;
                }
            }
        }
        var achievement;
        console.log("player = " + player.username + ", total goals count = " + goalsCount);
        if (goalsCount >= 50 && goalsCount < 100) {
            achievement = AchievementsCollection.ACHIEVEMENT_MAD;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
        else if (goalsCount >= 100 && goalsCount < 250) {
            achievement = AchievementsCollection.ACHIEVEMENT_SLAYER;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
        else if (goalsCount >= 250) {
            achievement = AchievementsCollection.ACHIEVEMENT_CHUCK_NORRIS;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
    });
    return game;
}

function calculateCleanSheetsVictories(player, game) {
    Game.find({
        $or: [
            {'team_white.players': player._id, 'team_white.score': 10, 'team_blue.score': 0},
            {'team_blue.players': player._id, 'team_white.score': 0, 'team_blue.score': 10}
        ]
    }).exec(function (err, games) {
        var achievement;
        if (games.length === 1) {
            achievement = AchievementsCollection.ACHIEVEMENT_IMPUDENT;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        } else if (games.length === 5) {
            achievement = AchievementsCollection.ACHIEVEMENT_WOW;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        } else if (games.length >= 10) {
            achievement = AchievementsCollection.ACHIEVEMENT_JEWELER;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
    });
    return game;
}

function calculateTotalVictoriesAchievements(player, game) {
    Game.find({
        $or: [
            {'team_white.players': player._id, 'team_white.score': 10},
            {'team_blue.players': player._id, 'team_blue.score': 10}
        ]
    }).exec(function (err, games) {
        var achievement;
        if (games.length === 10) {
            achievement = AchievementsCollection.ACHIEVEMENT_BULLET;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        } else if (games.length === 20) {
            achievement = AchievementsCollection.ACHIEVEMENT_ROCK;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        } else if (games.length >= 50) {
            achievement = AchievementsCollection.ACHIEVEMENT_ROCK_BULLET;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
    });
    return game;
}

function calculateGoldenGoalAchievement(player, game, team) {
    var achievement;
    if (team === GameController.TEAM_BLUE && game.team_white.score === 9) {
        achievement = AchievementsCollection.ACHIEVEMENT_GOLDEN_GOAL;
        achievement.time = new Date();
        game = addAchievement(achievement, player, game);
    } else if (team === GameController.TEAM_WHITE && game.team_blue.score === 9) {
        achievement = AchievementsCollection.ACHIEVEMENT_GOLDEN_GOAL;
        achievement.time = new Date();
        game = addAchievement(achievement, player, game);
    }
    return game;
}

function calculateDrinkPoisonAchievement(player, game) {
    Game.find({
        $or: [
            {'team_white.players': player._id},
            {'team_blue.players': player._id}
        ],
        $and: [
            {game_status: GameController.STATUS_FINISHED}
        ]
    }).sort({end_time: -1}).limit(5).exec(function (err, games) {
        var looseCount = 0;
        for (var i = 0; i < games.length; i++) {
            var nextGame = games[i];
            if (nextGame.team_white.players.indexOf(player._id) !== -1 && nextGame.team_white.score < 10) {
                looseCount++;
            } else if (nextGame.team_blue.players.indexOf(player._id) !== -1 && nextGame.team_blue.score < 10) {
                looseCount++;
            }
        }
        if (looseCount > 2 && looseCount < 5) {
            var achievement = AchievementsCollection.ACHIEVEMENT_DRINK_THE_POISON;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        } else if (looseCount > 4) {
            var achievement = AchievementsCollection.ACHIEVEMENT_LOSER;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
    });
    return game;
}

function calculatePerfectWeekAchievement(player, game) {
    Game.find({
        $or: [
            {'team_white.players': player._id},
            {'team_blue.players': player._id}
        ],
        $and: [
            {game_status: GameController.STATUS_FINISHED}
        ]
    }).sort({end_time: -1}).limit(7).exec(function (err, games) {
        var winCount = 0;
        for (var i = 0; i < games.length; i++) {
            var nextGame = games[i];
            if (nextGame.team_white.players.indexOf(player._id) !== -1 && nextGame.team_white.score === 10) {
                winCount++;
            } else if (nextGame.team_blue.players.indexOf(player._id) !== -1 && nextGame.team_blue.score === 10) {
                winCount++;
            }
        }
        if (winCount > 6) {
            var achievement = AchievementsCollection.ACHIEVEMENT_PERFECT_WEEK;
            achievement.time = new Date();
            game = addAchievement(achievement, player, game);
        }
    });
    return game;
}

function calculateWeAreBeautiful(game) {
    var achievement;
    for (var i = 0; i < TEAM_COUNT; i++) {
        var isLoose = game[TEAMS[i]].goals.length < 10;
        if (game[TEAMS[i]].players.length == 2) {
            var isNastya = game[TEAMS[i]].players[0].username === 'Настя Голубович' || game[TEAMS[i]].players[1].username === 'Настя Голубович';
            var isTanya = game[TEAMS[i]].players[0].username === 'Таня Зайцева' || game[TEAMS[i]].players[1].username === 'Таня Зайцева';
            if (isLoose && isTanya && isNastya) {
                achievement = AchievementsCollection.ACHIEVEMENT_WE_ARE_BEAUTIFUL;
                addAchievementToPlayers(game, TEAMS[i], achievement);
            }
        }
    }
    return game;
};

function calculateWall(game) {
    var achievement;
    var isLoose = game[TEAMS[0]].goals.length < 10;
    if (isLoose) {
        if (game[TEAMS[1]].goals.length - game[TEAMS[0]].goals.length > 5) {
            achievement = AchievementsCollection.ACHIEVEMENT_WALL;
            addAchievementToPlayers(game, TEAMS[1], achievement);
        }
    } else {
        if (game[TEAMS[0]].goals.length - game[TEAMS[1]].goals.length > 5) {
            achievement = AchievementsCollection.ACHIEVEMENT_WALL;
            addAchievementToPlayers(game, TEAMS[0], achievement);
        }
    }
    return game;
};

function calculateFlash(game) {
    var achievement;
    if (game.end_time.getTime() - game.start_time.getTime() < 1000 * 60 * 2) {
        achievement = AchievementsCollection.ACHIEVEMENT_FLASH;
        if (game[TEAMS[0]].goals.length === 10) {
            addAchievementToPlayers(game, TEAMS[0], achievement);
        } else {
            addAchievementToPlayers(game, TEAMS[1], achievement);
        }
    }
    return game;
};

function calculateBatman(game) {
    var achievement;
    if (game.end_time.getTime() - game.start_time.getTime() < 1000 * 60 * 3) {
        achievement = AchievementsCollection.ACHIEVEMENT_BATMAN;
        if (game[TEAMS[0]].goals.length === 10) {
            addAchievementToPlayers(game, TEAMS[0], achievement);
        } else {
            addAchievementToPlayers(game, TEAMS[1], achievement);
        }
    }
    return game;
};

function calculateBolt(game) {
    var achievement;
    for (var i = 0; i < TEAM_COUNT; i++) {
        if (game[TEAMS[i]].goals.length === 1) {
            var lastGoalFromStartTime = game[TEAMS[i]].goals[0].time.getTime() - game.start_time.getTime();
            if (lastGoalFromStartTime <= 5000) {
                achievement = AchievementsCollection.ACHIEVEMENT_BOLT;
                addAchievementToPlayers(game, TEAMS[i], achievement);
            }
        }
    }
    return game;
};

function calculateBeast(game) {
    var achievement;
    for (var i = 0; i < TEAM_COUNT; i++) {
        if (game[TEAMS[i]].goals.length > 2) {
            var goalsCount = game[TEAMS[i]].goals.length;
            var lastGoalTime = game[TEAMS[i]].goals[goalsCount - 1].time.getTime();
            var thirdGoalTime = game[TEAMS[i]].goals[goalsCount - 3].time.getTime();
            if (lastGoalTime - thirdGoalTime <= 1000 * 30) {
                achievement = AchievementsCollection.ACHIEVEMENT_BEAST;
                addAchievementToPlayers(game, TEAMS[i], achievement);
            }
        }
    }
    return game;
}

function calculateGunner(game) {
    var achievement;
    for (var i = 0; i < TEAM_COUNT; i++) {
        if (game[TEAMS[i]].goals.length > 4) {
            var goalsCount = game[TEAMS[i]].goals.length;
            var lastGoalTime = game[TEAMS[i]].goals[goalsCount - 1].time.getTime();
            var fifthGoalTime = game[TEAMS[i]].goals[goalsCount - 5].time.getTime();
            if (lastGoalTime - fifthGoalTime <= 1000 * 60) {
                achievement = AchievementsCollection.ACHIEVEMENT_BEAST;
                addAchievementToPlayers(game, TEAMS[i], achievement);
            }
        }
    }
    return game;
}

function addAchievementToPlayers(game, team, achievement) {
    var playersCount = game[team].players.length;
    for (var i = 0; i < playersCount; i++) {
        var player = game[team].players[i];
        addAchievement(achievement, player, game);
    }
}

function calculateGoalSeries(game) {

    var lastBlueGoal = 0;
    var lastWhiteGoal = 0;
    var achievement;
    if (game.team_blue.goals.length > 0) {
        lastBlueGoal = game.team_blue.goals[game.team_blue.goals.length - 1].time.getTime();
    }
    if (game.team_white.goals.length > 0) {
        lastWhiteGoal = game.team_white.goals[game.team_white.goals.length - 1].time.getTime();
    }
    function addAchievementToWhitePlayers(achievement) {
        for (var i = 0; i < game.team_white.players.length; i++) {
            var whitePlayer = game.team_white.players[i];
            addAchievement(achievement, whitePlayer, game);
        }
    }

    function addAchievementToBluePlayers(achievement) {
        for (var i = 0; i < game.team_blue.players.length; i++) {
            var bluePlayer = game.team_blue.players[i];
            game = addAchievement(achievement, bluePlayer, game);
        }
    }

    if (game.team_white.goals.length >= 3) {
        if (game.team_white.goals[game.team_white.goals.length - 3].time.getTime() > lastBlueGoal) {
            achievement = AchievementsCollection.ACHIEVEMENT_UNSTOPPABLE;
            achievement.time = new Date();
            addAchievementToWhitePlayers(achievement);
        }
    }
    if (game.team_white.goals.length >= 5) {
        if (game.team_white.goals[game.team_white.goals.length - 5].time.getTime() > lastBlueGoal) {
            achievement = AchievementsCollection.ACHIEVEMENT_SHAITAN;
            achievement.time = new Date();
            addAchievementToWhitePlayers(achievement);
        }
    }
    if (game.team_white.goals.length >= 7) {
        if (game.team_white.goals[game.team_white.goals.length - 7].time.getTime() > lastBlueGoal) {
            achievement = AchievementsCollection.ACHIEVEMENT_SKOROSTREL;
            achievement.time = new Date();
            addAchievementToWhitePlayers(achievement);
        }
    }
    if (game.team_blue.goals.length >= 3) {
        if (game.team_blue.goals[game.team_blue.goals.length - 3].time.getTime() > lastWhiteGoal) {
            achievement = AchievementsCollection.ACHIEVEMENT_UNSTOPPABLE;
            achievement.time = new Date();
            addAchievementToBluePlayers(achievement);
        }
    }
    if (game.team_blue.goals.length >= 5) {
        if (game.team_blue.goals[game.team_blue.goals.length - 5].time.getTime() > lastWhiteGoal) {
            achievement = AchievementsCollection.ACHIEVEMENT_SHAITAN;
            achievement.time = new Date();
            addAchievementToBluePlayers(achievement);
        }
    }
    if (game.team_blue.goals.length >= 7) {
        if (game.team_blue.goals[game.team_blue.goals.length - 7].time.getTime() > lastWhiteGoal) {
            achievement = AchievementsCollection.ACHIEVEMENT_SKOROSTREL;
            achievement.time = new Date();
            addAchievementToBluePlayers(achievement);
        }
    }
    return game;
}