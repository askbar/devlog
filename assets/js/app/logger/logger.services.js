angular.module('devlog.logger.services', [])

.provider('Logger', function() {
  return {
    $get: ['$resource', function($resource) {
      return {
        // Conect to a logger socket instance
        tail: function(data) {
          io.socket.get('/api/logger/tail', data, function(resData, jwres) {
            console.log('jwres', jwres);
          });
        },
        contents: $resource('api/logger/read', {
            get: {
              method: 'GET',
              isArray: false
            }
        }),\
      };
    }]
  };
});