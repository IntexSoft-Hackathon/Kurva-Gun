'use strict';

app.factory('User', function ($resource) {
  return $resource('/auth/users/:id/', {id: '@_id'},
      {
        'update': {
          method: 'PUT'
        },
      checkProjectAccess:{
        url:'/auth/projects/:projectId',
        method: 'GET'
      }
      });
});
