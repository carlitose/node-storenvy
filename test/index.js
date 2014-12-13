var Hapi = require('hapi'),
	Storenvy = require('../lib/storenvy'),
	ClientTests = require('./clientTests'),
	PublicTests = require('./publicTests');

var server = new Hapi.Server();
server.connection({port: 8080});

var APP_ID = '<YOUR_APPLICATION_ID';
var APP_SECRET = '<YOUR_APP_SECRET>';
var REDIRECT_URL = 'http://localhost:8080/';

var globalClient;

var storenvy = new Storenvy({
	appId: APP_ID,
	appSecret: APP_SECRET,
	redirect: REDIRECT_URL
});

server.route({
	method: 'GET',
	path: '/authenticate',
	handler: function(request, reply) {
		return reply().redirect(storenvy.buildOAuthUrl(true, true));
	}
});

server.route({
	method: 'GET',
	path: '/',
	handler: function(request, reply) {
		storenvy.generateClient(request.query.code, function(err, client) {
			if(err) console.err(err);
			globalClient = client;
			reply().redirect('/test');
		});
	}
});

server.route({
	method: 'GET',
	path: '/test',
	handler: function(request, reply) {
		ClientTests.runAll(globalClient);
		PublicTests.runAll();
	}
});

server.start(function() {
	console.log('Server running at ' + server.info.uri);
});






