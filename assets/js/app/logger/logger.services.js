angular.module('devlog.logger.services', [])

.provider('Logger', function() {
  return {
    $get: function() {
      return {
        start: function(data) {
          // Conect to a logger socket instance
          io.socket.get('/api/logger/start', data, function(resData, jwres) {
            console.log('jwres', jwres);
          });
        },
        stop: function(data) {
          // Kill logger
          io.socket.get('/api/logger/stop', data, function(resData, jwres) {
            console.log('jwres', jwres);
          });
        }
      };
    }
  };
});