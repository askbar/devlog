var _ = require('lodash');

module.exports = {

    find: function(req, res) {
    	sails.log.debug('find all profiles');
    	Profile.find().exec(function(err, profiles) {
			return res.json(profiles);
    	});
    },

    findOne: function(req, res) {
    	sails.log('find one profile by name');
    	Profile.findOne({ name:req.params.name }).exec(function (err, profile) {
    	  if (err) {
    	    return res.serverError(err);
    	  }
    	  if (!profile) {
    	    return res.notFound('Could not find , sorry.');
    	  }
    	  return res.json(profile);
    	});
    },

    create: function(req, res) {
    },

    update: function(req, res) {

    },

    destroy: function(req, res) {

    }

};