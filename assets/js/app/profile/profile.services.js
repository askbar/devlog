angular.module('devlog.profile.services', [])

.provider('Profile', function() {
  return {
    $get: function($resource) {
      var Profile = $resource('profiles');
      return Profile;
    }
  };
});