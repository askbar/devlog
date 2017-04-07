angular.module('devlog.profile.services', [])

.provider('$profileApi', function() {
  return {
    $get: function($resource) {
      return $resource('profiles');
    }
  };
});