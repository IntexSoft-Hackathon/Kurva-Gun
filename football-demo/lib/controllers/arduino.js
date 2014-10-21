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

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var eventEmitter = require('events').EventEmitter;
var util = require('util');

var Arduino = function () {

    var self = this;

    self.LISTENING_MESSGAE = "LISTENING";
    self.STOP_GAME_MESSAGE = "STOP";
    self.GOAL_WHITE_MESSAGE = "GOAL:WHITE";
    self.GOAL_BLUE_MESSAGE = "GOAL:BLUE";

    self.START_GAME_COMMAND = "1";
    self.STOP_GAME_COMMAND = "2";

    self.PORT_NUMBER = "COM3";

    self.ARDUINO_START_COMMAND = "arduino:start";
    self.ARDUINO_READY_COMMAND = "arduino:ready";
    self.ARDUINO_STOP_COMMAND = "arduino:stop";
    self.ARDUINO_IS_STOPPED = "arduino:stopped";
    self.ARDUINO_GOAL = "arduino:goal";

    self.PORT_OPEN_COMMAND = "open";
    self.PORT_CLOSE_COMMAND = "close";
    self.PORT_ERROR_COMMAND = "error";
    self.PORT_RECEIVE_DATA_COMMAND = "data";

    var portIsReady = true;

    var serialPort = new SerialPort(self.PORT_NUMBER, {
        parser: serialport.parsers.readline("\r\n"),
        baudrate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    }, true);


// open connection and listening port
    serialPort.on(self.PORT_OPEN_COMMAND, function () {
        serialPort.on(self.PORT_RECEIVE_DATA_COMMAND, function (arduinoMessage) {
            if (arduinoMessage === self.LISTENING_MESSGAE) { // arduino is ready
                self.emit(self.ARDUINO_READY_COMMAND, arduinoMessage);
            } else if (arduinoMessage === self.STOP_GAME_MESSAGE) { // stop command or timeout stop
                self.emit(self.ARDUINO_IS_STOPPED, arduinoMessage);
            } else if (arduinoMessage === self.GOAL_WHITE_MESSAGE || arduinoMessage === self.GOAL_BLUE_MESSAGE) { // goal in white gate (point for blue team)
                self.emit(self.ARDUINO_GOAL, arduinoMessage);
            }
        });
    });

    serialPort.on(self.PORT_CLOSE_COMMAND, function () {
        portIsReady = false;
    });

    serialPort.on(self.PORT_ERROR_COMMAND, function () {
        portIsReady = false;
    });

    self.on(self.ARDUINO_READY_COMMAND, function () {
        portIsReady = true;
    });

    self.on(self.ARDUINO_START_COMMAND, function () {
        if (portIsReady) {
            serialPort.write(self.START_GAME_COMMAND);
        }
    });

    self.on(self.ARDUINO_STOP_COMMAND, function () {
        if (portIsReady) {
            serialPort.write(self.STOP_GAME_COMMAND);
        }
    });

    self.start = function () {
        self.emit(self.ARDUINO_START_COMMAND);
    };

    self.stop = function () {
        self.emit(self.ARDUINO_STOP_COMMAND);
    };

};

util.inherits(Arduino, eventEmitter);

module.exports = Arduino;


