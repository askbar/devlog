module.exports = {
	attributes: {
		name: {
			type: 'string',
			unique: true,
			required: true
		},
		lines: {
			type: 'integer',
			required: true,
			defaultsTo: 100,
			enum: [100, 250, 500, 1000]
		},
		profiles: {
			collection: 'profile',
			via: 'watchers',
			dominant: true
		}
	}
};