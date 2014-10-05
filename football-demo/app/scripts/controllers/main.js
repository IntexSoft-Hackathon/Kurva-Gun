'use strict';

app.controller('MainCtrl', function ($scope, ngDialog, $location, Api, Socket) {

  $scope.users = {};
   

  $scope.getUsers = function() {
    Api.getGames().query(function(game){
      if(!game || game.game_status !== 'IN_PROGRESS') {
        Api.getUsers().query(function (users) {
          $scope.users = users;
        });
      } else {
        $location.path('game');
      }
    });

  };

  $scope.openDetails = function(user, position){
    $scope.currentUser = user;
    $scope.currentUser.position = position;
    var confirm = ngDialog.openConfirm({
      template: 'views/partials/dialogs/playerDetails.html',
      className: 'ngdialog-theme-plain',
      scope: $scope,
      showClose: false,
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
            showClose: false,
            closeByDocument: true
        });
        newGame.then(function () {
          $location.path('game');
        });
    };

    Socket.on('user:new', function () {
      $scope.getUsers();
    });

});
