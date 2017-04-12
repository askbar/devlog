var _ = require('lodash');
var Tail = require('tail').Tail;

process.on('message', function(msg) {	

	this.tail = null;

	this._startTail = function() {

		// Start tailing a filepath
		this.tail = new Tail(msg.path);

		this.tail.on('line', function(data) {
			console.log(data);
			try {
				process.send(data);
			}
			catch(err) {
				sails.log.error('TailWorker: tail encountered an error; process will be terminated');
				this._stopTail();
			}
		}.bind(this));

		this.tail.on('error', function() {
			sails.log.error('TailWorker: tail encountered an error; process will be terminated');
			this._stopTail();
		}.bind(this));

	};

	this._stopTail = function() {
		sails.log.debug('TailWorker: stop process');
		try {
			process.disconnect();
		}
		catch (err) {
			sails.log.error('TailWorker: error stopping process', err.message, '\n', err.stack);			
		}
	};

	this._init = function() {
		if (!_.isEmpty(msg) && msg.start ) {
			this._startTail();
		}
		else if (!_.isEmpty(msg) && msg.stop) {
			this._stopTail();
		}
		else {
			sails.log.error('TailWorker: invalid parameters, cannot start process.');
		}
	}.bind(this)();

});

process.on('uncaughtException', function() {

});