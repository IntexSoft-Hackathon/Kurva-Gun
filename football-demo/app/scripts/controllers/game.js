'use strict';

app.controller('GameCtrl', function ($scope, Api, Socket, ngDialog, $location) {

  $scope.users = {};
  $scope.game = {};
  $scope.selectedPlayer = {};
  $scope.selectedPosition = 0;

  $scope.getGame = function() {
    Api.getGames().game(function(game){
      $scope.game = game;
    });
  };

  function selectUser(players, position, selectedPlayer) {
    players[position] = selectedPlayer;
    Api.getGames().update($scope.game, function(game){
    });
  };

  $scope.getPlayers = function(){
    var white_players = $scope.game.team_white.players;
    var blue_players = $scope.game.team_blue.players;
    Api.getUsers().query(function(players){
      $scope.players = players
          .filter(function (el) {
            var inWhiteTeam = $.grep(white_players, function(e){ return e ? e._id == el._id : false; });
            var inBlueTeam = $.grep(blue_players, function(e){ return e ? e._id == el._id : false; });
            return !inWhiteTeam.length && !inBlueTeam.length;
          });
    });
  };

  $scope.openListPlayers = function(team, position){
    if ($scope.game.game_status == "NEW") {
      $scope.selectedPosition = position;
      var confirm = ngDialog.openConfirm({
        template: 'views/partials/dialogs/listPlayers.html',
        className: 'ngdialog-theme-plain',
        scope: $scope,
        showClose: false,
        closeByDocument: true
      });
      confirm.then(function (selectedPlayer) {
        if (team === "white") {
          selectUser($scope.game.team_white.players, $scope.selectedPosition, selectedPlayer);
        } else {
          selectUser($scope.game.team_blue.players, $scope.selectedPosition, selectedPlayer);
        }
      });
    }
  };

  Socket.on('user:new', function () {
      $scope.getUsers();
  });

  $scope.start = function() {
    $scope.game.game_type = "TEAM";
    Api.getGames().start($scope.game, function(){}) ;
  };

  $scope.stop = function () {
    Api.getGames().stop($scope.game, function () {
      $location.path('players');
    });
  };

  $scope.toTimestamp = function(date) {
    return new Date(date).getTime();
  };

  function gameStartListener(game) {
    $scope.game = game;
  }

  function gameUpdateListener(game) {
    $scope.game = game;
    //Stub example for achivement
  }

  function gameEndListener(game) {
    $scope.end_game = {};
    $scope.end_game.winner_players = game.team_white.score === 10 ? game.team_white.players : game.team_blue.players;
    $scope.end_game.winner_team = game.team_white.score === 10 ? "WHITE" : "BLUE";

    if (game.game_status == "FINISHED") {
      var confirm = ngDialog.openConfirm({
        template: 'views/partials/dialogs/winner.html',
        className: 'ngdialog-theme-plain',
        scope: $scope,
        showClose: false,
        closeByDocument: true
      });
      confirm.then(function () {
      });
    }
  }

  function gameAchievementListener(player, achievement) {
    console.log(player);
    console.log(achievement);
    $.amaran({
      content: {
        title: player.username + 'got new Achievement',
        message: achievement.name,
        info: achievement.description,
        icon: 'fa fa-download'
      },
      position: 'top right',
      theme: 'awesome ok',
      inEffect: 'slideRight',
      delay: 10000
    });
  }

  //Init socket listeners
  Socket.on('game:start', gameStartListener);
  Socket.on('game:update', gameUpdateListener);
  Socket.on('game:end', gameEndListener);
  Socket.on('game:achievement', gameAchievementListener);
  //Clean up
  $scope.$on('$destroy', function iVeBeenDismissed() {
    Socket.removeListener('game:start', gameStartListener);
    Socket.removeListener('game:update', gameUpdateListener);
    Socket.removeListener('game:end', gameEndListener);
    Socket.removeListener('game:achievement', gameAchievementListener);
  })
});
