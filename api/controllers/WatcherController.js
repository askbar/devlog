var _ = require('lodash');

module.exports = {

	_config: {
		actions: true,
		rest: true,
		pluralize: true
	},

    //=======================================================================
		// Profile CRUD
    //=======================================================================

    find: function(req, res) {
    	Watcher.find().populate('profiles').exec(function(err, watchers) {
			return res.json(200, watchers);
    	});
    },

    findOne: function(req, res) {
    	Watcher.findOne({ id: req.param('id') })
    		.populate('profiles')
    		.exec(function (err, watcher) {
	    	  if (err) {
	    	    return res.json(500, err);
	    	  }
	    	  if (!watcher) {
	    	    return res.json(500, { message: 'Could not find watcher with id ' + req.param('id') });
	    	  }
	    	  return res.json(200, watcher);
	    	});
    },

    create: function(req, res) {
			Watcher.findOne({
				name: req.param('name')
			}).exec(function(err, watcher) {
				if (err) {
					return res.json(500, err);
				}
				if (!watcher) {
					Watcher.create(req.allParams()).exec(function(err, record) {
						if (err) {
							return res.json(500, err);
						}
						return res.json(200, record);
					});
				}
				else {
					return res.json(500, {
						message: 'watcher with name ' + req.param('name') + ' already exists!'
					});
				}
			});
    },

    update: function(req, res) {
			Watcher.update({
				id: req.param('id')
			}, req.allParams()).exec(function(err, watcher) {
				if (err) {
					return res.json(500, err);
				}
				return res.json(200, {
					message: 'updated watcher with id ' + req.param('id')
				});
			});
    },

    destroy: function(req, res) {
			Watcher.destroy({
				id: req.param('id')
			}).exec(function(err) {
				if (err) {
					return res.json(500, err);
				}
				return res.json(200, {
					message: 'deleted watcher with id ' + req.param('id')
				});
			});

    }

};