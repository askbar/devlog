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
		
		var pid,
			process,
			params = req.param('params');

		sails.sockets.join(req, params.id, function(err) {
			
			if (err) {
				return res.json(500, err);
			}
			
			process = childProcess.fork(processPath);
			pid = process.pid;

			process.send({
				params: params
			});

			process.on('message', function(msg) {
				sails.sockets.broadcast(params.id, msg.event, msg);
			});

			console.log('start tail', pid);

			return res.json(200, {
				message: 'tailing all file paths registered under the profile ' + params.id,
				data: {
					id: params.id,
					paths: params.paths,
					pid: pid
				}
			});
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

		readLastLines.read(path, lines).then(function(lines) {
			return res.json(200, {
				path: path,
				lines: lines.split('\n')
			});
		});
	},

	stop: function(req, res) {
		
		if (!req.isSocket) {
			return res.badRequest();
		}

		var params = req.param('params');
		console.log('params', params.pid);

		process.on('message', function(msg) {
			// Transmit the final message that the process is killed
			sails.sockets.broadcast(params.id, msg.event, msg);
			// Leave the broadcast channel
			sails.sockets.leave(req, params.id);
		});

		process.kill(params.pid);

		return res.json(200, {
			message: 'stopped tailing file paths in profile' + params.id
		});

	}
};