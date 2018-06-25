module.exports = {
	createTemplate: createTemplate,
	getSso: getSso,
	getTicket: getTicket,
	getSesion: getSesion,
	getUserInfo: getUserInfo,
	setHeaders: setHeaders,
	getUploadToken: getUploadToken,
	upload: upload,
	getTplData: getTplData,
	getCmpId: getCmpId,
	createPoster: createPoster,
	getUploadTokenNew: getUploadTokenNew,
	getSid: getSid,
	saveTemplate: saveTemplate,
	publishTpl: publishTpl,
	uploadMusic: uploadMusic
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').rabbit;
var serverHost = config.severHost;
var editServerHost = config.editServerHost;
var extend = require('./../utils').extend;
var fetch = require('node-fetch');

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
		url: serverHost + 'user/syncnewsso?isAjax=true',
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
	// return request.get({
	// 	url: serverHost + 'user/info',
	// 	headers: extend(headers, _headers)
	// }, {getCookie: true});
	
	return fetch(editServerHost + 'api/user/newinfo', {
		headers: _headers,
	});
}

function getSid() {
	return fetch(editServerHost + 'api/org/package', {
		headers: _headers,
	});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createTemplate(data) {
	return fetch(editServerHost + 'api/app', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: _headers,
	}).then(res=>{
		return res.json()
	});
}

/**
 * 保存模板
 * @param {*} data 
 */
function saveTemplate(data) {
	return fetch(editServerHost + 'api/app/' + data.appExtId, { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: _headers,
	}).then(res=>{
		return res.json()
	});
}

function publishTpl(data) {
	return fetch(editServerHost + 'api/app/publish/ ' + data.appExtId, { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: _headers,
	}).then(res=>{
		return res.json()
	});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createPoster(data) {
	return request.post({
		url: serverHost + 'spa',
		headers: _headers,
		data: querystring.stringify(data)
	});
}

/**
 * [getUploadToken 上传token]
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
 * [getUploadTokenNew 上传token新]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function getUploadTokenNew(data) {
	var url = editServerHost + 'api/upload/token';
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
	return fetch(editServerHost + 'api/upload/uploaded', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: _headers,
	}).then(res=>{
		return res.json()
	});
}

function uploadMusic(data) {
	return fetch(editServerHost + 'api/upload/uploadedByUser', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: _headers,
	}).then(res=>{
		return res.json()
	});
}

function getTplData(id) {
	var url = serverHost + 'app/user/'+ id +'?isAjax=true';
	return request.get({
		url: url,
		headers: _headers
	});
}

function getCmpId(data) {
	return request.put({
		url: serverHost + 'cmp',
		headers: _headers,
		data: querystring.stringify(data)
	});
}