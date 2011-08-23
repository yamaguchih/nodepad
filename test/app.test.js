process.env.NODE_ENV = 'test';

var app = require('../app');

module.exports = {
	'POST /documents.json': function(assert) {
			assert.response(app, {
					url: '/documents.json', 
					method: 'POST',
					data: JSON.stringify({ document: { title: 'Test' }}),
					headers: { 'Content-Type': 'application/json' }
			}, {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			},

			function(res) {
				var document = JSON.parse(res.body);
				assert.equal('Test', document.title);
			});
	}
};
