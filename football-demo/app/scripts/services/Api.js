app.factory('Api', function ($resource) {

  return {
    getUsers: function(){

      return $resource('/auth/users/:id/', {id: '@_id'},
          {
            'update': {
              method: 'PUT'
            }
          });

    },
    getGames: function(){
      return $resource('/api/game/:id/', {id: '@_id'},
          {
            'update': {
              method: 'PUT'
            },
            start:{
              url:'/api/game/:id/start',
              method: 'POST',
              isArray:false
            },
            stop: {
              url: '/api/game/:id/stop',
              method: 'POST',
              isArray: false
            },
            game:{
            method:'GET',
            isArray:false
            },
              updateQueue: {
                  url: '/api/queue/update',
                  method: 'POST',
                  isArray: true
              },
              getQueue: {
                  url: '/api/queue',
                  method: 'GET',
                  isArray: true
              }
          });

    }
  };
});
