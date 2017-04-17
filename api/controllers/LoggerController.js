var path = require('path');
var childProcess = require("child_process");
var processPath = path.resolve(__dirname, '..', 'services/processes') + "/TailWorker";
var _ = require('lodash');
var fs = require('fs');

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
		if (_.isEmpty(path)) {
			return res.json(500, {
				message: 'path is empty'
			});
		}
		fs.readFile(path, 'utf-8', function(err, data) {
			if (err) {
				return res.json(500, err);
			}
			return res.json(200, {
				path: path,
				lines: data.toString().split('\n')
			});
		});
	},

	stop: function(req, res) {
		
		if (!req.isSocket) {
			return res.badRequest();
		}

		var params = req.param('params');
		process.kill(params.pid, 'SIGINT');

		sails.sockets.leave(req, params.id, function(err) {
			if (err) {
				return res.json(500, err);
			}
			return res.json(200, {
				message: 'stopped tailing file paths in profile' + params.id
			});
		});

	}
};