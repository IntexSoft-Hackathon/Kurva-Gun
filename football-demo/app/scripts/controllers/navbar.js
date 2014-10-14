'use strict';

app.controller('NavbarCtrl', function ($rootScope, $scope, Auth, $location, $routeParams, ngDialog) {
  var isDialogOpened = false;
  $rootScope.$watch('currentUser', function(){
    $scope.isAdmin = $rootScope.currentUser ? $rootScope.currentUser.admin : false;
  }, true);

  $scope.links = [{active: false}, {active: false}, {active: false}, {active: false}];
  $scope.sublinks = [{active: false}, {active: false}, {active: false}, {active: false}];

  $scope.routeParams = $routeParams;

  $scope.openNewGame = function () {
    if (!isDialogOpened) {
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
    }
  };

  $rootScope.$on('ngDialog.opened', function () {
    isDialogOpened = true;
  });

  $rootScope.$on('ngDialog.closed', function () {
    isDialogOpened = false;
  });

  $scope.checkLocation = function () {
    switch ($location.path()) {
      case '/calendar/iterations':
        $scope.links[1].active = true;
        break;
      case '/calendar/tasks':
        $scope.links[2].active = true;
        break;
      case '/projects':
        $scope.links[0].active = true;
        break;
      default:
        if ($location.path().indexOf('projects') > -1) {
          $scope.links[0].active = true;
        }
        break;
    }
  };
  $scope.changeLocation = function (index) {
    for (var i = 0; i < $scope.links.length; i++) {
      $scope.links[i].active = i === index;
    }
    $scope.project = {};
  };

  $scope.subChangeLocation = function (index) {
    for (var i = 0; i < $scope.sublinks.length; i++) {
      $scope.sublinks[i].active = i === index;
    }
  };

  $scope.open = function () {
    for (var i = 0; i < $scope.links.length; i++) {
      $scope.links[i].active = i === 0;
    }
    $location.path('/projects/' + $scope.project.id);
  };

  $scope.logout = function () {
    Auth.logout(function (err) {
      if (!err) {
        $location.path('/login');
      }
    });
  };
});
