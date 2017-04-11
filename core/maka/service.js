module.exports = {
	createScene: createScene,
	setHeaders: setHeaders,
	template: template,
	getOssConfig: getOssConfig,
	upload: upload
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').maka;
var serverHost = config.severHost;
var utils = require('./../utils');

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
		url: serverHost + 'template',
		headers: _headers,
		data: ''
	});
}

function template(code) {
	var url = serverHost + 'v4/template/' + code + '?template_type=designer&data_type=base';
	return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [getOssConfig 获取阿里云token]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function getOssConfig(userToken) {
	var url = serverHost + 'ossSts2?token=' + userToken;
	return request.get({
		url: url,
		headers: _headers
	});
}

function upload(path, data, token) {
	// x-oss-date
	//x-oss-security-token
	//Authorization
	var headers = extend({
			'x-oss-date': token.Credentials.Expiration,
			'x-oss-security-token': token.Credentials.SecurityToken,
			'Authorization': ''
		}, _headers);
	return request.put({
		url: path,
		headers: headers,
		data: data
	});
}