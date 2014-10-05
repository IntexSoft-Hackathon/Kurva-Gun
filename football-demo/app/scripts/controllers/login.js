'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, Auth, $location) {
      $scope.error = {};
      $scope.user = {};
      $scope.signup = false;
      $scope.login = function (form) {
        Auth.login('password', {
              'username': $scope.user.username,
              'password': $scope.user.password
            },
            function (err) {
              $scope.errors = {};

              if (!err) {
                if ($rootScope.originalUrl) {
                  $location.path($rootScope.originalUrl);
                  $rootScope.originalUrl = null;
                } else {
                  $location.path('/');
                }
              } else {
                angular.forEach(err.errors, function (error, field) {
                  form[field].$setValidity('mongoose', false);
                  $scope.errors[field] = error.type;
                });
                $scope.error.other = err.message;
              }
            });
      };

      $scope.register = function (form) {
        Auth.createUser({
              username: $scope.user.username,
              password: $scope.user.password
            },
            function (err) {
              $scope.errors = {};

              if (!err) {
                $location.path('/');
              } else {
                angular.forEach(err.errors, function (error, field) {
                  form[field].$setValidity('mongoose', false);
                  $scope.errors[field] = error.type;
                });
              }
            }
        );
      };
    });