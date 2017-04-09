angular.module('devlog.profile.services', [])

.provider('Profile', function() {
  return {
    $get: function($resource) {
      var Profile = $resource('profiles/:id', {
        id: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });
      return Profile;
    }
  };
});