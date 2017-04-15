var _ = require('lodash');
var Tail = require('tail').Tail;

process.on('message', function(msg) {	

	this.tails = [];

	this.stopTail = function() {

		_.each(this.tails, function(tail) {
			tail.unwatch(); // Stop tailing
		});

		process.send({
			event: 'stopTail',
			params: {
				id: msg.params.id,
				paths: msg.params.paths
			}
		});
		
		process.exit();
	};

	if (_.isEmpty(msg)) {
		console.log('TailWorker: invalid parameters, cannot start process.');
	}

	var scope = this;

	_.each(msg.params.paths, function(path) {

		// Start tailing a filepath
		var tail = new Tail(path, {
			fromBeginning: true
		});

		tail.on('line', function(data) {
			try {
				process.send({
					event: 'newLine',						
					params: {
						path: path,
						line: data
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

	console.log('startTail');
	
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
	this.stopTail();
});

process.on('uncaughtException', function(error) {
	if (!_.eq(error.toString(), 'Error: IPC channel is already disconnected')) {
		process.send({
			operation: 'stopTail'
		});
  }
});