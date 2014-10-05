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
              url:'/api/game/start',
              method: 'POST'
            },
            exit:{
              url:'/api/game/exit',
              method: 'POST'
            }
          });

    }
  };
});
