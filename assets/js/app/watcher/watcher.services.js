angular.module('devlog.watcher.services', [])

.provider('Watcher', function() {
  return {
    $get: function($resource) {
      var Watcher = $resource('watchers/:id', {
        id: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });
      return Watcher;
    }
  };
});