app.factory('Socket', function (socketFactory) {
    var myIoSocket = io.connect();
    return socketFactory({ioSocket: myIoSocket});
});