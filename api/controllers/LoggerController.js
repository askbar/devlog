var path = require('path');
var childProcess = require("child_process");
var processPath = path.resolve(__dirname, '..', 'services/processes') + "/TailWorker";
var _ = require('lodash');
var fs = require('fs');
var readLastLines = require('read-last-lines');

module.exports = {

	start: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest();
		}
    	
		var watcherId = req.param('id');

		LoggerService.startTail(watcherId, req, function(err, data) {
			if (err) {
				return res.json(500, err);
			}
			return res.json(200, data);
		});
	},

	stop: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest();
		}

		var watcherId = req.param('id');
		LoggerService.stopTail(watcherId, req, function(err, data) {
			if (err) {
				return res.json(500, err);
			}
			return res.json(200, data);
		});
	},

	read: function(req, res) {

		var path = req.param('path');
		var lines = req.param('lines') || 100;

		if (_.isEmpty(path)) {
			return res.json(500, {
				message: 'path is empty'
			});
		}

		FileSystemService.fileExists(path, function(err, p) {
			if (err) {
				return res.json(500, {
					path: path,
					message: path + ' does not exist or is not readable!'
				});
			}
			// if file exists and is readable, then read the first 'n' lines of it
			readLastLines.read(path, lines).then(function(lines) {
				return res.json(200, {
					path: path,
					lines: lines.split('\n')
				});
			});
		});
	}
};