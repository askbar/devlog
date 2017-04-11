module.exports = {
	attributes: {
		// profile name
		name: {
			type: 'string',
			unique: true,
			required: true
		},
		// an array of file path locations to watch in this machine
		paths: {
			type: 'array'
		},
		watchers: {
			collection: 'watcher',
			via: 'profiles'
		}
	}
};