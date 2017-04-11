angular.module('devlog.main.services', [])

.run(['lodash', 'moment', 'jquery', '$log',
  function(_, moment, $, $log) {
    $log.debug('angular', angular.version.full);
    $log.debug('lodash', _.VERSION);
    $log.debug('moment', moment.version);
    $log.debug('jquery', $.fn.jquery);
  }
])

.provider('lodash', [
  function() {
    return {
      $get: function($window, $rootScope) {
        var _ = $window._;
        delete($window._);
        $rootScope._ = _;
        return (_);
      }
    };
  }
])

.provider('jquery', [
  function() {
    return {
      $get: function($window) {
        var $ = $window.jQuery.noConflict();
        $window.$ = $;
        return ($);
      }
    };
  }
])

.provider('moment', [
  function() {
    return {
      $get: function($window) {
        $window.moment = moment;
        return (moment);
      }
    };
  }
])

.provider('FileSystem', function() {
  return {
    $get: function($resource) {
      return {
        tree: $resource('api/tree', null, {
          query: {
            method: 'GET',
            isArray: false
          }
        }),
        up: $resource('api/tree/up', null, {
          query: {
            method: 'GET',
            isArray: false
          }
        })
      };
    }
  };
})

.factory('FileSystemUtils', ['lodash', function(_) {
  return {
    escapePath: function(path) {
      if (_.isEmpty(path)) {
        return path;
      }
      return path.replace(/\\/g, "\\\\");
    }
  };
}]);