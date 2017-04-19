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

	tail: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest();
		}
		
		var operation = req.param('operation'),
				params = req.param('params');

		if (_.eq(operation, 'startTail')) {

			sails.sockets.join(req, params.id, function(err) {
				
				if (err) {
					return res.json(500, err);
				}
				
				var proc = childProcess.fork(processPath);
				var pid = process.pid;

				console.log('forked process with pid', pid);

				proc.send({
					params: params
				});

				proc.on('message', function(msg) {
					sails.sockets.broadcast(params.id, msg.event, msg, req);
				});

				return res.json(200, {
					message: 'tailing all file paths registered under the profile ' + params.id,
					data: {
						id: params.id,
						paths: params.paths,
						pid: proc.pid
					}
				});
			});
		}
		else if (_.eq(operation, 'stopTail')) {

			// kill process
			// process.kill(params.pid, 'SIGINT');

			// Leave the broadcast channel
			sails.sockets.leave(req, params.id);

			return res.json(200, {
				message: 'stopped tailing file paths in profile' + params.id
			});
		}

	},

	read: function(req, res) {

		var path = req.param('path');
		var lines = req.param('lines') || 100;

		if (_.isEmpty(path)) {
			return res.json(500, {
				message: 'path is empty'
			});
		}

		readLastLines.read(path, lines).then(function(lines) {
			return res.json(200, {
				path: path,
				lines: lines.split('\n')
			});
		});
	}
};