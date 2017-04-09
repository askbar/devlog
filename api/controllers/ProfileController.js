var _ = require('lodash');

module.exports = {

    find: function(req, res) {
    	Profile.find().exec(function(err, profiles) {
				return res.json(200, profiles);
    	});
    },

    findOne: function(req, res) {
    	Profile.findOne({ id: req.param('id') }).exec(function (err, profile) {
    	  if (err) {
    	    return res.json(500, err);
    	  }
    	  if (!profile) {
    	    return res.json(500, { message: 'Could not find profile with id ' + req.param('id') });
    	  }
    	  return res.json(200, profile);
    	});
    },

    create: function(req, res) {
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
			Profile.update({
				id: req.param('id')
			}, req.allParams()).exec(function(err, profile) {
				if (err) {
					return res.json(500, err);
				}
				return res.json(200, {
					message: 'updated profile with id ' + req.param('id')
				});
			});
    },

    destroy: function(req, res) {
			Profile.destroy({
				id: req.param('id')
			}).exec(function(err) {
				if (err) {
					return res.json(500, err);
				}
				return res.json(200, {
					message: 'deleted profile with id ' + req.param('id')
				});
			});

    }
};