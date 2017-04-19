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
		automatic: {
			type: 'boolean',
			required: false,
			defaultsTo: false
		},
		tailing: {
			type: 'boolean',
			required: false,
			defaultsTo: false
		},
		pids: {
			type: 'array',
			required: false,
			defaultsTo: []
		},
		profiles: {
			collection: 'profile',
			via: 'watchers',
			dominant: true
		},
		toJSON: function() {
            var obj = this.toObject();
            delete obj.pids;
            return obj;
        }
	}
};