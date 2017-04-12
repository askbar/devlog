var childProcess = require("child_process");
var _ = require('lodash');
var path = require('path');

var _watchers = {};

module.exports = {

	start: function(req, res) {

		var socket = req.socket;
		var path = req.param('path');
		var currentDir = path.resolve(__dirname, '..', 'services/processes');
		var tailWorkerChild = childProcess.fork(currentDir + "/TailWorker");
		var pid = tailWorkerChild.pid;

		tailWorkerChild.send({
			start: true,
			path: path
		});

		// socket.join(pid);
		// socket.broadcast.to(pid).emit('newTail', pid);

		tailWorkerChild.on('message', function(msg) {
			console.log('message from process', msg);
	    	// socket.broadcast.to(pid).emit('newLine', msg);
		}.bind(this));

		_watchers[tailWorkerChild.pid] = tailWorkerChild;

		return res.json(200, {
			message: 'tailing ' + path + ' with process ' + pid
		});

	},

	stop: function(req, res) {
		
		var pid = req.param('pid');
		var tailWorkerChild = _watchers[pid];

		tailWorkerChild.send({
			stop: true
		});

		_watchers = _.reject(_watchers, function(v, k) {
			return _.eq(k, pid);
		});

	    // socket.leave(pid);

		return res.json(200, {
			message: 'tailing ' + path + ' with process ' + pid
		});
	}


};