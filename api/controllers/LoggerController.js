var path = require('path');
var childProcess = require("child_process");
var processPath = path.resolve(__dirname, '..', 'services/processes') + "/TailWorker";
var _ = require('lodash');

module.exports = {

	start: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest();
		}
		var operation = req.param('operation'),
				params = req.param('params'), 
				process = childProcess.fork(processPath),
				pid = process.pid;
			
		sails.sockets.join(req, params.id, function(err) {
			
			if (err) {
				return res.json(500, err);
			}

			process.on('message', function(msg) {
				sails.sockets.broadcast(params.id, msg.event, msg);
			});

			process.send({
				operation: operation,
				params: params
			});

			return res.json(200, {
				message: 'tailing all file paths registered under the profile ' + params.id,
				data: {
					paths: params.paths,
					pid: pid
				}
			});
		});
	},

	stop: function(req, res) {
		
		if (!req.isSocket) {
			return res.badRequest();
		}

		var operation = req.param('operation'),
				params = req.param('params');

		if (_.eq(operation, 'stopTail')) {

			process.kill(params.pid, 'SIGINT');

			// sails.sockets.leave(req, params.id, function(err) {
			// 	if (err) {
			// 		return res.json(500, err);
			// 	}
			// 	return res.json(200, {
			// 		message: 'stopped tailing file paths in profile' + params.id
			// 	});
			// });
		}

	}
};