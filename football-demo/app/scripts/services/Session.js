'use strict';

app.factory('Session', function ($resource) {
  return $resource('/auth/session/');
});
