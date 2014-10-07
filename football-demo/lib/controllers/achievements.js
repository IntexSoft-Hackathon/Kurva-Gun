'use strict';

var util = require("util"),
    EventEmitter = require('events').EventEmitter,
    GameController = require('../../app.js').gameController;

GameController.on(GameController.GAME_START_EVENT, function (game) {
    console.log("Calculate game start achievements");
});

GameController.on(GameController.GAME_UPDATE_EVENT, function (game) {
    console.log("Calculate game update achievements");
});

GameController.on(GameController.GAME_END_EVENT, function (game) {
    console.log("Calculate end game achievements");
});