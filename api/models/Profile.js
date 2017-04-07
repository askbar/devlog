module.exports = {
	attributes: {
		// profile id
		id: {
			type: 'string',
			unique: true,
			required: true
		},
		folders: {
			type: 'array'
		},
		files: {
			type: 'array'
		}
	}
};