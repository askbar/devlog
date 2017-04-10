var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');

//=======================================================================
// Private methods
//=======================================================================

var _process = function(_p, callback) {
	var files = [];
	fs.readdir(_p, function(err, list) {
		if (err) {
			return callback(err);
		}
		_.each(list, function(file) {
			files.push(async.apply(_processNode, _p, file));
		});
		async.parallel(files, function(err, result) {
			callback(null, result);
		});
	});
};

var _processNode = function(_p, f, callback) {
	fs.stat(path.join(_p, f ), function(err, stats) {
		if (err) {
			return callback(err);
		}
		callback(null, {
			id: path.join(_p, f),
			text: f,
			isDirectory: stats.isDirectory(),
			state: {
				opened: false,
				disabled: false,
				selected: false
			},
			attrs: {
				base: path.join(_p),
				isLeaf: stats.isFile()
			},
			children: stats.isDirectory()
		});
	});
};

module.exports = {

    //=======================================================================
    // File system browsing API
    //=======================================================================
    
    tree: function(req, res) {
    	
    	var _p,
    		id = req.param('id');

    	if (_.isEmpty(id)) {
    		_p = path.resolve(__dirname, '../..');
    	}
    	else {
    		_p = id;
    	}

    	async.waterfall([
    		async.apply(_process, _p)
		], function(err, results) {
			return res.json(200, {
				currentDir: _p,
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
    		async.apply(_process, _p)
		], function(err, results) {
			return res.json(200, {
				currentDir: _p,
				files: results
			});
		});
    }

};