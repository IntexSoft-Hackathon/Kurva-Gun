app.factory('Api', function ($resource) {

  return {
    getUsers: function(){

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

    }
  };
});
