var portNumber = "COM4";
console.log("start " + portNumber);

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort(portNumber, {
    baudrate: 9600,
//    defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}, true);

console.log("start listeners " + portNumber);

serialPort.on("open", function () {
    console.log('open');

    serialPort.on('data', function (data) {
        console.log('data received: ' + data);
    });
});

//var serialport = require("serialport");
//var SerialPort = serialport.SerialPort; // localize object constructor
//
//var sp = new SerialPort("COM1", {
//    parser: serialport.parsers.readline("\n")
//});