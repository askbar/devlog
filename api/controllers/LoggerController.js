var path = require('path');
var childProcess = require("child_process");
var processPath = path.resolve(__dirname, '..', 'services/processes') + "/TailWorker";
var _ = require('lodash');

var _watchers = {};

module.exports = {

	start: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest();
		}

	  var paths = req.param('paths'),
				roomId = req.param('id');
		
		// save the room id
		_watchers[roomId] = {};

		// create a room based on the watcher id
		sails.sockets.join(req, roomId, function(err) {

			if (err) {
				return res.serverError(err);
			}

			_.each(paths, function(p) {

				var tailWorkerChild = childProcess.fork(processPath),
						pid = tailWorkerChild.pid;

				tailWorkerChild.send({
					start: true,
					path: p
				});

				tailWorkerChild.on('message', function(msg) {
					
					console.log('message from process', msg);
					
					sails.socket.broadcast(roomId, 'line', {
						line: msg
					});

				});

				_watchers[roomId][pid] = {
					worker: tailWorkerChild,
					path: p
				};

			}.bind(this));

			return res.json(200, {
				message: 'tailing all file paths registered under the profile ' + roomId,
				roomId: roomId,
				paths: paths,
				pids: _.keys(_watchers[roomId])
			});

		});
	},

	stop: function(req, res) {
		
		if (!req.isSocket) {
			return res.badRequest();
		}

		var roomId = req.param('id'), 
				room = _watchers[id];

		_.each(room, function(process) {
			var worker = process.worker;
			worker.send({
				stop: true
			});
		});

		_watchers[roomId] = null;
		delete _watchers[roomId];

		sails.socket.leave(req, roomId, function(err) {
			if (err) {
				return res.serverError(err);
			}
			return res.json(200, {
				message: 'stopped tailing file paths in profile' + roomId
			});
		});
	}
};