var _ = require('lodash');

module.exports = {

    find: function(req, res) {
    	sails.log.debug('find all profiles');
    	Profile.find().exec(function(err, profiles) {
			return res.json(profiles);
    	});
    },

    findOne: function(req, res) {
    	sails.log('find one profile by id', req.param('id'));
    	Profile.findOne({ name:req.param('id') }).exec(function (err, profile) {
    	  if (err) {
    	    return res.json(500, err);
    	  }
    	  if (!profile) {
    	    return res.json(500, { message: 'Could not find , sorry.' });
    	  }
    	  return res.json(200, profile);
    	});
    },

    create: function(req, res) {

			console.log('create profile with params', req.allParams());
			console.log('profile name', req.param('name'));

			Profile.findOne({
				name: req.param('name')
			}).exec(function(err, profile) {
				if (err) {
					return res.json(500, err);
				}
				if (!profile) {
					Profile.create(req.allParams()).exec(function(err, record) {
						if (err) {
							return res.json(500, err);
						}
						return res.json(200, record);
					});
				}
				else {
					return res.json(500, {
						message: 'profile with name ' + req.param('name') + ' already exists!'
					});
				}
			});
    },

    update: function(req, res) {

    },

    destroy: function(req, res) {

    }

};