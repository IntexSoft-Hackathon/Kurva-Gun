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

  $scope.cancel = function() {
    $location.path('players');
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
    $.amaran({
      content:{
        title:'Player got new Achivment',
        message:"It's Kurva Gun",
        info:'Yahoooooooo!',
        icon:'fa fa-download'
      },
      position:'top right',
      theme:'awesome ok',
      inEffect:'slideRight',
      delay:10000
    });
  }

  function gameEndListener(game) {
    $scope.endGame = game;
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
  //Init socket listeners
  Socket.on('game:start', gameStartListener);
  Socket.on('game:update', gameUpdateListener);
  Socket.on('game:end', gameEndListener);
  //Clean up
  $scope.$on('$destroy', function iVeBeenDismissed() {
    Socket.removeListener('game:start', gameStartListener);
    Socket.removeListener('game:update', gameUpdateListener);
    Socket.removeListener('game:end', gameEndListener);
  })
});
