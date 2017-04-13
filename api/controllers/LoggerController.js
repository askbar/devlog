var childProcess = require("child_process");
var _ = require('lodash');
var path = require('path');

var _watchers = {};

module.exports = {

	start: function(req, res) {

	    var socketId = sails.sockets.id(req);
		var p = req.param('path');
		var tailWorkerChild = childProcess.fork(path.resolve(__dirname, '..', 'services/processes') + "/TailWorker");
		var pid = tailWorkerChild.pid;

		tailWorkerChild.send({
			start: true,
			path: p
		});

		// socket.join(pid);
		// socket.broadcast.to(pid).emit('newTail', pid);

		tailWorkerChild.on('message', function(msg) {
			console.log('message from process', msg);
	    	// socket.broadcast.to(pid).emit('newLine', msg);
		}.bind(this));

		_watchers[tailWorkerChild.pid] = {
			worker: tailWorkerChild,
			path: p
		};

		return res.json(200, {
			message: 'tailing ' + p + ' with process ' + pid
		});

	},

	stop: function(req, res) {
		
		var pid = req.param('pid');
		var childProcess = _watchers[pid];
		var worker = childProcess.worker;

		worker.send({
			stop: true
		});

		_watchers = _.reject(_watchers, function(v, k) {
			return _.eq(k, pid);
		});

	    // socket.leave(pid);

		return res.json(200, {
			message: 'stopped tailing ' + childProcess.path + ' [' + pid + ']'
		});
	}


};