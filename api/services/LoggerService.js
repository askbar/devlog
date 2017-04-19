var _ = require('lodash');
var Tail = require('tail').Tail;

var _pool = {};

module.exports = {

  startTail: function(id, req, cb) {
    	
      Watcher.findOne({
        id: id
      })
  		.populate('profiles')
  		.exec(function (err, watcher) {
    	  
        if (err) {
          return cb(err, null);
    	  }

        // Create an entry in the pool
        _pool[id] = [];

        var profiles = watcher.profiles;
  
        sails.sockets.join(req, id, function(error) {

          _.each(profiles, function(profile) {
            var paths = profile.paths;
            _.each(paths, function(path) {

              var tail = new Tail(path, {
                fromBeginning: false
              });

              tail.on('line', function(data) {
                sails.sockets.broadcast(id, 'newLine', {
                  id: id,
                  line: data,
                  path: path
                });
              });

              tail.on('error', function(error) {
                sails.sockets.broadcast(id, 'tailError', {
                  id: id,
                  error: error,
                  path: path
                });
              });

              // Store the tail object under the pool id
              _pool[id].push(tail);

            });
          });

          // Update watcher model instance
          watcher.tailing = true;

          watcher.save(function(error) {
            if (error) {
              return cb(err, null);
            }
            sails.sockets.broadcast(id, 'startTail', watcher);
            cb(null, watcher);
          });
        });
    	});
  },

  stopTail: function(id, req, cb) {

    var tails = _pool[id];

    _.each(tails, function(tail) {
      tail.unwatch();
    });

    delete _pool[id];

    Watcher.findOne({
      id: id
    }).exec(function(err, watcher) {

      if (err) {
        return cb(err, null);
      }

      watcher.tailing = false;

      watcher.save(function(error) {

        if (error) {
          return cb(error, null);
        }
        
        sails.sockets.broadcast(id, 'stopTail', watcher);
        sails.sockets.leave(req, id, function(err) {
          return cb(null, watcher);
        });
      });
    });
  }
};