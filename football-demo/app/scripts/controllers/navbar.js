'use strict';

app.controller('NavbarCtrl', function ($rootScope, $scope, Auth, $location, $routeParams) {
  $scope.menu = [{
    "title": "Blogs",
    "link": "blogs"
  }];

  $rootScope.$watch('currentUser', function(){
    $scope.isAdmin = $rootScope.currentUser ? $rootScope.currentUser.admin : false;
  }, true);

  $scope.links = [{active: false}, {active: false}, {active: false}, {active: false}];
  $scope.sublinks = [{active: false}, {active: false}, {active: false}, {active: false}];

  $scope.routeParams = $routeParams;

  $scope.select2ProjectsOptions = {
    ajax: {
      url: "api/projects/",
      quietMillis: 100,
      data: function (term) {
        return {filter: {name:term}};
      },
      results: function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
          array.push({id: data[i]._id, text: data[i].name});
        }
        $scope.projects = array;
        return {results: array};
      }
    },
    id: function (element) {
      return element.id;
    },
    formatSelection: function (exercise) {
      $scope.currentSelect = exercise;
      return exercise.text;
    },
    initSelection: function (element, callback) {
      // this is telling select2 how to inialize the pre-existing values
      callback($scope.currentSelect);
    }
  };

  $scope.$watch('routeParams.projectId', function () {
    if ($scope.routeParams.projectId) {
      $scope.findProject($scope.routeParams.projectId);
      $scope.subCheckLocation();
    }
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

  $scope.subCheckLocation = function () {
    switch ($location.path()) {
      case '/projects/' + $scope.routeParams.projectId:
        $scope.subChangeLocation(0);
        break;
      case '/projects/' + $scope.routeParams.projectId + '/timelines':
        $scope.subChangeLocation(1);
        break;
      case '/projects/' + $scope.routeParams.projectId + '/checklists':
        $scope.subChangeLocation(2);
        break;
      case '/projects/' + $scope.routeParams.projectId + '/issues':
        $scope.subChangeLocation(3);
        break;
      default:
        $scope.subChangeLocation(null);
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

  $scope.findProject = function (id) {
    if (id) {
      Projects.get({
        projectId: id
      }, function (project) {
        $scope.project = {id: project._id, text: project.name};
        $scope.currentSelect = {id: project._id, text: project.name};
      });
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
