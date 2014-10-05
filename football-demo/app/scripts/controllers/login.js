'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, Auth, User, $location, $upload) {
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
              password: $scope.user.password,
              photo: $scope.user.photo
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

    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        console.log(file);
        $scope.upload = $upload.upload({
          url: '/auth/users/uploadImage', //upload.php script, node.js route, or servlet url
          data: {myObj: $scope.myModelObj},
          file: file
        }).progress(function(evt) {
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
          $scope.user.photo = data.path;
        });
      }
    };
    });