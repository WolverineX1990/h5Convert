module.exports = {
	createScene: createScene,
	setHeaders: setHeaders
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').maka;
var serverHost = config.severHost;

var _headers;

/**
 * [setHeaders 设置http header]
 * @param {[type]} headers [description]
 */
function setHeaders(headers) {
	_headers = headers;
}

function createScene() {
	return request.post({
		url: serverHost + 'template/',
		headers: _headers,
		data: ''
	});
}