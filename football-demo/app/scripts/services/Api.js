app.factory('Api', function ($resource) {

  return {
    getRatings: function(){

      return $resource('/api/rating/:id/', {id: '@user'},
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
