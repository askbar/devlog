module.exports = {
	attributes: {
		name: {
			type: 'string',
			unique: true,
			required: true
		},
		profiles: {
			collection: 'profile',
			via: 'watchers',
			dominant: true
		}
	}
};