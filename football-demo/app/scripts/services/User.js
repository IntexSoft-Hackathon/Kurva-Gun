'use strict';

app.factory('User', function ($resource) {
  return $resource('/auth/users/:id/', {id: '@_id'},
      {
        'update': {
          method: 'PUT'
        },
      uploadImage:{
        url:'/auth/users/uploadImage',
        method: 'POST'
      }
      });
});
