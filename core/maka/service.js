module.exports = {
	createScene: createScene
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').maka;
var serverHost = config.severHost;

function createScene() {
	return request.post({
		data: querystring.stringify(data),
		url: serverHost + 'template'//,
		// headers: _headers
	});
}