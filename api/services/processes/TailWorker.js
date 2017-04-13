var _ = require('lodash');
var Tail = require('tail').Tail;

process.on('message', function(msg) {	

	this.tail = null;

	this._startTail = function() {

		var scope = this;

		// Start tailing a filepath
		this.tail = new Tail(msg.path, {
			fromBeginning: true	,
		});

		this.tail.on('line', function(data) {
			try {
				process.send(data);
			}
			catch(err) {
				console.log('TailWorker: tail encountered an error; process will be terminated');
				scope._stopTail();
			}
		});

		this.tail.on('error', function() {
			console.log('TailWorker: tail encountered an error; process will be terminated');
			scope._stopTail();
		});

	};

	this._stopTail = function() {
		this.tail.unwatch(); // Stop tailing
		try {
			process.disconnect();
		}
		catch (err) {
			console.log('TailWorker: error stopping process', err.message, '\n', err.stack);			
		}
	};

	this._init = function() {
		if (_.isEmpty(msg)) {
			console.log('TailWorker: invalid parameters, cannot start process.');
		}
		else {
			if (msg.start) {
				this._startTail();
			}
			if (msg.stop) {
				this._stopTail();
			}
		}
	}.bind(this)();

});

process.on('uncaughtException', function() {

});