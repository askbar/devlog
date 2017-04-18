var _ = require('lodash');
var Tail = require('tail').Tail;

process.on('message', function(msg) {	

	if (_.isEmpty(msg)) {
		console.log('TailWorker: invalid parameters, cannot start process.');
		process.exit();
	}

	this.tails = [];
	this.stopTail = function() {

		console.log('stopTail');

		_.each(this.tails, function(tail) {
			tail.unwatch(); // Stop tailing
		});

		process.send({
			event: 'stopTail',
			params: {
				id: msg.params.id,
				paths: msg.params.paths,
				pid: process.pid
			}
		});
		
		process.exit();
	};

	console.log('startTail');

	var scope = this;

	_.each(msg.params.paths, function(path) {

		// Start tailing a filepath
		var tail = new Tail(path, {
			fromBeginning: false
		});

		tail.on('line', function(data) {
			try {
				process.send({
					event: 'newLine',						
					params: {
						id: msg.params.id,
						path: path,
						line: data,
						pid: process.pid
					}
				});
			}
			catch(err) {
				console.log('TailWorker: tail encountered an error; process will be terminated');
				scope.stopTail();
			}
		});

		tail.on('error', function() {
			console.log('TailWorker: tail encountered an error; process will be terminated');
			scope.stopTail();
		});

		scope.tails.push(tail);
	});

	process.send({
		event: 'startTail',				
		params: {
			id: msg.params.id,				
			paths: msg.params.paths,
			pid: process.pid
		}
	});

});

process.on('exit', function() {
	this.stopTail();
});

process.on('SIGINT', function() {
	console.log('process SIGINT');
	this.stopTail();
});

process.on('SIGHUP', function() {
	console.log('process SIGHUP');
	this.stopTail();
});

process.on('uncaughtException', function(error) {
	if (!_.eq(error.toString(), 'Error: IPC channel is already disconnected')) {
		this.stopTail();
  }
});