var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');

module.exports = {
	process: function(_p, callback) {
		var files = [];
		var scope = this;
		fs.readdir(_p, function(err, list) {
			if (err) {
				return callback(err);
			}
			_.each(list, function(file) {
				files.push(async.apply(scope.processNode, _p, file));
			});
			async.parallel(files, function(err, result) {
				callback(null, result, _p);
			});
		});
	},

	processNode: function(_p, f, callback) {
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
	},

	resolve: function(id, callback) {
		if (_.isEmpty(id)) {
			callback(null, path.resolve(__dirname, '../..'));
		}
		else {
			async.waterfall([
				function(cb) {
					fs.stat(id, function(err, stats) {
						var p;
						if (err) {
							return cb(err);
						}
						if (stats.isFile()) {
							p = path.dirname(id);
			    		}
			    		else {
			    			p  = id;
			    		}
			    		return cb(null, p);
					});
				}
			], function(err, path) {
				callback(null, path);
			});
		}
	}
};
