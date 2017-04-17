angular.module('devlog.logger.services', [])

.provider('Logger', function() {
  return {
    $get: [function() {
      return {
        // Conect to a logger socket instance
        start: function(data) {
          io.socket.get('/api/logger/start', data, function(resData, jwres) {
            console.log('jwres', jwres);
          });
        },
        read: function(data, cb) {
          io.socket.get('/api/logger/read', data, cb);
        },
        // Kill logger        
        stop: function(data) {
          io.socket.get('/api/logger/stop', data, function(resData, jwres) {
            console.log('jwres', jwres);
          });
        }
      };
    }]
  };
});