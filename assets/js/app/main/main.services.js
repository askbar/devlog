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
      $get: function($window) {

        var _ = $window._;
        delete($window._);
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