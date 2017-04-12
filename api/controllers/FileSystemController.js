var _ = require('lodash');
var path = require('path');
var async = require('async');

module.exports = {

    //=======================================================================
    // File system browsing API
    //=======================================================================
    
    tree: function(req, res) {
    	async.waterfall([
    		async.apply(FileSystemService.resolve, req.param('id')),
    		FileSystemService.process
		], function(err, results, path) {
			if (err) {
				return res.json(500, err);
			}
			return res.json(200, {
				currentDir: path,
				files: results
			});
		});
    },

    up: function(req, res) {
    
    	var id = req.param('id'),
			_p = path.resolve(id, '..');

    	if (_.isEmpty(id)) {
    		return res.json(500, {
    			message: 'parent id not supplied'
    		});
    	}

    	async.waterfall([
    		async.apply(FileSystemService.process, _p)
		], function(err, results) {
			return res.json(200, {
				currentDir: _p,
				files: results
			});
		});
    }
};