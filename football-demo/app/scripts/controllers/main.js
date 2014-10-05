'use strict';

app.controller('MainCtrl', function ($scope, ngDialog, $location, Api, Socket) {

  $scope.ratings = {};

  $scope.getRatings = function() {
    Api.getRatings().query(function(ratings){
      $scope.ratings = ratings;
    });

  };

  $scope.openDetails = function(){
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

    Socket.on('rating:new', function () {
      $scope.getRatings();
    });

});
