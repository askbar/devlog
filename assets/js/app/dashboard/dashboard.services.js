angular.module('devlog.dashboard.services', [])

.provider('$testApi', function() {
  return {
    $get: function($resource) {
      return $resource('/test');
    }
  };
});