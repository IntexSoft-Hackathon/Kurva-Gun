//Commands from arduino:
// 'GOAL:WHITE' - goal to white gate
// 'GOAL:BLUE' - goal to blue gate
// 'LISTENING' - waiting for commands
// 'START' - game is started
// 'CALIBRATION' - sensors are in calibration
// 'STOP' - game is stopped

//Commands to arduino:
// 1 - start game
// 2 - stop game

var Game = require('./game.js')

var LISTENING_MESSGAE = "LISTENING";
var SATRT_GAME_MESSAGE = "START";
var STOP_GAME_MESSAGE= "STOP";
var GOAL_WHITE_MESSAGE = "GOAL:WHITE";
var GOAL_BLUE_MESSAGE = "GOAL:BLUE";

var START_GAME_COMMAND = "1";
var STOP_GAME_COMMAND = "2";

var PORT_NUMBER = "COM3";

var portIsReady = false;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var events = require('events');
var eventEmitter = new events.EventEmitter();

var serialPort = new SerialPort(PORT_NUMBER, {
    parser: serialport.parsers.readline("\r\n"),
    baudrate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}, true);


// open connection and listening port
serialPort.on("open", function () {

    serialPort.on("data", function (arduinoMessage) {
        console.log(arduinoMessage);
        if (arduinoMessage === LISTENING_MESSGAE) { // arduino is ready
            portIsReady = true;
        } else if (arduinoMessage === STOP_GAME_MESSAGE) { // stop command or timeout stop
            Game.stop();
        } else if (arduinoMessage === GOAL_WHITE_MESSAGE || arduinoMessage === GOAL_BLUE_MESSAGE) { // goal in white gate (point for blue team)
            Game.goal(arduinoMessage);
        }
    });
});

serialPort.on('close', function() {
    portIsReady = false;
});

serialPort.on('error', function() {
    portIsReady = false;
});

exports.startGame = function() {
    if (portIsReady) {
        serialPort.write(START_GAME_COMMAND);
    }
}

exports.stopGame = function() {
    if (portIsReady) {
        serialPort.write(STOP_GAME_COMMAND);
    }
}


