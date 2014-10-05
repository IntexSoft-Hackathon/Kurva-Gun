'use strict';

app.controller('GameCtrl', function ($scope, Api, Socket, ngDialog) {

    $scope.users = {};
  $scope.game = {};

    $scope.getUsers = function() {
        Api.getUsers().query(function(users){
            $scope.users = users;
        });

    };
  $scope.getGame = function() {
    Api.getGames().game(function(game){
      $scope.game = game;
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

  $scope.startOrCancel = function() {
    if ($scope.game.team_white && $scope.game.team_white.players.length + $scope.game.team_blue.players.length == 4){
      Api.getGames().start(function(){ }) ;
    } else {
      Api.getGames().start(function(){ }) ;
    }
  };

  $scope.getButtonText = function() {
    if ($scope.game.team_white && ($scope.game.team_white.players.length + $scope.game.team_blue.players.length) == 4) {
      return "НАЧАТЬ ИГРУ";
    } else {
      return "ВЫЙТИ";
    }
  };

  Socket.on('game:end', function(){
    var confirm = ngDialog.openConfirm({
      template: 'views/partials/dialogs/winner.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: false,
      closeByDocument: true
    });
    confirm.then(function () {
    });
  });

  Socket.on('game:update', function(game){
    $scope.game = game;
  })

});
