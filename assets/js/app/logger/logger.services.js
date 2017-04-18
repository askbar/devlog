angular.module('devlog.logger.services', [])

.provider('Logger', function() {
  return {
    $get: ['$resource', function($resource) {
      return {
        // Conect to a logger socket instance
        start: function(data) {
          io.socket.get('/api/logger/start', data, function(resData, jwres) {
            console.log('jwres', jwres);
          });
        },
        contents: $resource('api/logger/read', {
            get: {
              method: 'GET',
              isArray: false
            }
        }),
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