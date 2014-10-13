'use strict';

app.controller('PlayersCtrl', function ($scope, ngDialog, $location, Api, Socket) {
  var sortingMap = ['-count_games', '-win', '-lost', '-level', '-experience'];
  $scope.users = {};
  $scope.currentSorting = '-experience';


  $scope.getUsers = function() {
        Api.getUsers().query(function (users) {
          $scope.users = users;
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

  $scope.changeSorting = function (i) {
    if ($scope.currentSorting !== sortingMap[i]) {
      $scope.currentSorting = sortingMap[i];
    } else {
      $scope.currentSorting = $scope.currentSorting.slice(1);
    }

  };

  function refreshListener() {
    $scope.getUsers();
  }

  Socket.on('user:new', refreshListener);
  Socket.on('game:update', refreshListener);
  Socket.on('game:end', refreshListener);
  //Clean up
  $scope.$on('$destroy', function () {
    Socket.removeListener('user:new', refreshListener);
    Socket.removeListener('game:update', refreshListener);
    Socket.removeListener('game:end', refreshListener);
  })

});
