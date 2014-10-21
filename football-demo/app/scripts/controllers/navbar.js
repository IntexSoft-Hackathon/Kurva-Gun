'use strict';

app.controller('NavbarCtrl', function ($rootScope, $scope, Auth, $location, ngDialog) {
  var isDialogOpened = false;

  $scope.openNewGame = function () {
      $location.path('game');
    /*if (!isDialogOpened) {
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
    }*/
  };

  $rootScope.$on('ngDialog.opened', function () {
    isDialogOpened = true;
  });

  $rootScope.$on('ngDialog.closed', function () {
    isDialogOpened = false;
  });

  $scope.logout = function () {
    Auth.logout(function (err) {
      if (!err) {
        $location.path('/login');
      }
    });
  };
});
