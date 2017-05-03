module.exports = {
	createTemplate: createTemplate,
	getSso: getSso,
	getTicket: getTicket,
	getSesion: getSesion,
	getUserInfo: getUserInfo,
	setHeaders: setHeaders,
	getUploadToken: getUploadToken,
	upload: upload
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').rabbit;
var serverHost = config.severHost;
var extend = require('./../utils').extend;

var _headers;

/**
 * [setHeaders 设置http header]
 * @param {[type]} headers [description]
 */
function setHeaders(headers) {
	_headers = headers;
}

function getSso(headers) {
	return request.get({
		url: serverHost + 'user/syncsso',
		headers: extend(headers, _headers)
	}, {getCookie: true});
}

function getTicket(url) {
	return request.get({
		url: url,
		headers: _headers
	}, {getCookie: true});
}

function getSesion() {
	return request.get({
		url: 'http://eps.rabbitpre.com/api/user/session?callback=undefined',
		headers: _headers
	}, {getCookie: true});
}

function getUserInfo(headers) {
	return request.get({
		url: serverHost + 'user/info',
		headers: extend(headers, _headers)
	}, {getCookie: true});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createTemplate(data) {
	return request.post({
		url: serverHost + 'app',
		headers: _headers,
		data: querystring.stringify(data)
	});
}

/**
 * [getUploadToken ]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function getUploadToken(data) {
	var url = serverHost + 'upload/params';
	return request.get({
		url: url,
		headers: _headers,
		data: data
	});
}

/**
 * [upload 上传]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function upload(data) {
	var url = serverHost + 'upload/uploaded';
	return request.post({
		url: url,
		headers: _headers,
		data: querystring.stringify(data)
	});
}