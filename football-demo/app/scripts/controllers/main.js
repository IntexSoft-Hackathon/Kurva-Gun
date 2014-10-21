'use strict';

app.controller('MainCtrl', function ($scope, ngDialog, $location, Api) {

    $scope.getView = function () {
        Api.getGames().game(function (game) {
            if (!game || game.game_status !== 'IN_PROGRESS') {
                $location.path('players');
            } else {
                $location.path('game');
            }
        });

    };

});
