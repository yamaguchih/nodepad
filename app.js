
/**
 * Module dependencies.
 */

var express = require('express'),
	app = module.exports = express.createServer();
	mongoose = require('mongoose').Mongoose,
	db,
  Document;

// Models


// Configuration

app.configure(function(){
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	db = mongoose.connect('mongodb://localhost/nodepad-development');
});

app.configure('production', function(){
  app.use(express.logger());
	app.use(express.errorHandler()); 
	db = mongoose.connect('mongodb://localhost/nodepad-production');
});

app.configure('test', function() {
	app.use(express.errorHandler( { dumpExceptions: true, showStack: true}));
	db = mongoose.connect('mongodb://localhost/nodepad-test');
});

app.Document = Document = require('.models.js').Document(db);

// Routes

app.get('/', function(req, res){
	res.redirect('/documents')
});

//Routes

// GET

// :format can be json of html
app.get('/documents.:format?', function(req, res) {
		// Some kind of Mongo query/update
		Document.find().all(function(documents) {
				switch (req.query.format) {
						// When json, generate suitable data
						case 'json':
							res.send(documents.map(function(d) {
									return d.toJSON;
							}));
						break;
						// Else render a database template
            			default:
							res.render('documents/index.jade', {
								locals: { documents: documents }
							});
				}
		});
});

app.get('/documents/:id.:format?/edit', function(req, res) {
	Document.findById(req.query.id, function(d) {
		res.render('documents/edit.jade', {
			locals: { d: d }
		});
	});
});

app.get('/documents/new', function(req, res) {
	res.render('documents/new.jade', {
		locals: { d: new Document() }
	});
});

// POST
app.post('/documents.:format?', function(req, res) {
		var document = new Document(req.body['document']);
		document.save(function() {
				switch (req.query.format) {
						case 'json':
							res.send(document.toJSON);
						break;

						default:
							res.redirect('/documents');
				}
		});
})




app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
