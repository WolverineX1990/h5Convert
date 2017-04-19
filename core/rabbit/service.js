module.exports = {
	createTemplate: createTemplate,
	test: test,
	test1: test1,
	test2: test2,
	test3: test3,
	setHeaders: setHeaders,
	getTemplate: getTemplate,
	getOssSts2: getOssSts2,
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

function test() {
	return request.get({
		url: 'http://www.rabbitpre.com/user/syncsso',
		headers: _headers
	}, {getCookie: true});
}

function test1(data) {
	return request.get({
		url: 'http://www.rabbitpre.com/user/safeinfo',
		headers: _headers
	}, {getCookie: true});
}

function test2() {
	return request.get({
		url: 'http://www.rabbitpre.com/user/info?isAjax=true',
		headers: _headers
	}, {getCookie: true});
}

function test3() {
	return request.get({
		url: 'http://sso.rabbitpre.com/checkStatus'
	});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createTemplate(data) {
	console.log(_headers);
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
 * [getOssSts2 获取阿里云token]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function getOssSts2(userToken) {
	var url = serverHost + 'ossSts2?token=' + userToken;
	return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [upload 上传]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function upload(path, data, headers) {
	return request.put({
		url: path,
		headers: headers,
		data: data
	});
}