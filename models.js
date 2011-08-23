var mongoose = require('mongoose').Mongoose;

mongoose.model('Document', {
	properties: ['title', 'data', 'tags'],

	indexes: [
		'title'
	]

	getters: {
		id: function() {
			return this._id.toHexString();
		}
	}
});

exports.Document = function(db) {
	return db.model('Document');
};
