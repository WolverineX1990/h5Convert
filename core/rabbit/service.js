module.exports = {
	createTemplate: createTemplate,
	getSso: getSso,
	getTicket: getTicket,
	getSesion: getSesion,
	test2: test2,
	setHeaders: setHeaders,
	getTemplate: getTemplate,
	getUploadToken: getUploadToken,
	upload: upload,
	saveTemplate: saveTemplate
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').maka;
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
		url: 'http://www.rabbitpre.com/user/syncsso',
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

function test2(headers) {
	return request.get({
		url: 'http://www.rabbitpre.com/user/info',
		headers: extend(headers, _headers)
	}, {getCookie: true});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createTemplate(data) {
	return request.post({
		url: 'http://www.rabbitpre.com/app',
		headers: _headers,
		data: querystring.stringify(data)
	});
}

/**
 * [getTemplate 获取模板信息]
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
function getTemplate(code) {
	var url = serverHost + 'v4/template/' + code + '?template_type=designer&data_type=base';
	return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [saveTemplate 保存模板版本]
 * @param  {[type]} code    [description]
 * @param  {[type]} version [description]
 * @return {[type]}         [description]
 */
function saveTemplate(code, data) {
	var url = serverHost + 'v4/template/' + code;
	return request.put({
		url: url,
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
	var url = 'http://www.rabbitpre.com/upload/params';
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
function upload(data, headers) {
	var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com/';
	return request.post({
		url: url,
		headers: headers,
		data: data
	});
}