var _ = require('lodash');
var Tail = require('tail').Tail;

var _pool = {};

module.exports = {

  startTail: function(id) {

    	Profile.find({
        where: {
          watchers: id
        } 
      })
    		.populate('watchers')
    		.exec(function (err, profiles) {
	    	  
          if (err) {
	    	  }


          _.each(profiles, function(profile) {
            console.log(profile.paths);
          });

	    	});

  },

  stopTail: function(id) {

    var tails = _pool[id];

    _.each(tails, function(tail) {
      tail.unwatch();
    });

    delete _pool[id];

  }


};