'use strict';

app.controller('MainCtrl', function ($scope, ngDialog) {

    $scope.openDetails = function(){

        var confirm = ngDialog.openConfirm({
            template: 'views/partials/dialogs/playerDetails.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            showClose: true,
            closeByDocument: true
        });
        confirm.then(function () {

        });
    };

    $scope.openNewGame = function(){
        var newGame = ngDialog.openConfirm({
            template: 'views/partials/dialogs/newGame.html',
            className: 'ngdialog-theme-plain',
            scope: $scope,
            showClose: true,
            closeByDocument: true
        });
        newGame.then(function () {
        });
    }
});
