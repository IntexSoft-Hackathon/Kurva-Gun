'use strict';

app.controller('GameCtrl', function ($scope, ngDialog, Socket, Api) {

    $scope.users = {};

    $scope.getUsers = function() {
        Api.getUsers().query(function(users){
            $scope.users = users;
        });

    };

    $scope.openListPlayers = function(){
        var confirm = ngDialog.openConfirm({
            template: 'views/partials/dialogs/listPlayers.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            showClose: false,
            closeByDocument: true
        });
        confirm.then(function () {
        });
    };

    Socket.on('user:new', function () {
        $scope.getUsers();
    });
});
