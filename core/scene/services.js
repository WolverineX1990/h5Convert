module.exports = {
	createScene: createScene,
	createPage: createPage,
	savePage: savePage,
	getPages: getPages,
	publish: publish,
	getViewData: getViewData,
	setHeaders: setHeaders,
	getSceneDetail: getSceneDetail,
	getUpToken: getUpToken,
	saveSetting: saveSetting,
	setBgAudio: setBgAudio
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').eqx;
var serverHost = config.eqxSeverHost;
var vserverHost = config.eqxVSeverHost;
var s1Host = config.eqxS1Host;
var _headers;

/**
 * [setHeaders 设置http header]
 * @param {[type]} headers [description]
 */
function setHeaders(headers) {
	_headers = headers;
}

/**
 * [createScene 创建场景]
 * @return {[type]} [description]
 */
function createScene() {
	var data = {
		type: 101,
		pageMode: 0
	};
	return request.post({
		data: querystring.stringify(data),
		url: serverHost + 'm/scene/create',
		headers: _headers
	});
}

/**
 * [getSceneDetail 获取场景详情]
 * @param  {[type]} sceneId [description]
 * @return {[type]}         [description]
 */
function getSceneDetail(sceneId) {
	return request.get({
		url: serverHost + 'm/scene/detail/' + sceneId,
		headers: _headers
	});
}

/**
 * [createPage 创建页]
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
function createPage(pageId) {
	return request.get({
		url: serverHost + 'm/scene/createPage/' + pageId,
		headers: _headers
	});
}

/**
 * [savePage 保存页]
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
function savePage(page) {
	var url = vserverHost + 'm/scene/save';
	var data = {
		data: JSON.stringify(page),
		url: url,
		headers: _headers
	};
	data.headers['Content-Type'] = 'text/plain; charset=UTF-8';
	return request.post(data);
}

/**
 * [publish 发布]
 * @return {[type]} [description]
 */
function publish(sceneId, checkType) {
	var url = serverHost + 'm/scene/publish?id=' + sceneId;
    if (checkType) {
        url += (/\?/.test(url) ? '&' : '?') + 'checkType=' + checkType;
    }
    url += '&?time='+Date.now();
    return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [saveSetting 场景设置]
 * @param  {[type]} meta [description]
 * @return {[type]}      [description]
 */
function saveSetting(meta) {
	var url = serverHost + 'm/scene/setting/save';
	var data = {
		data: JSON.stringify(meta),
		url: url,
		headers: _headers
	};
	// data.headers['Content-Type'] = 'text/plain; charset=UTF-8';
	return request.post(data);
}

function setBgAudio(bgAudio) {
	var url = serverHost + 'm/scene/audio/set';
	var data = {
		data: JSON.stringify(bgAudio),
		url: url,
		headers: _headers
	};
	data.headers['Content-Type'] = 'application/x-www-form-urlencoded';

	return request.post(data);
}

/**
 * [getUpToken 获取上传token]
 * @return {[type]} [description]
 */
function getUpToken(type) {
    return request.post({
        url: serverHost + 'm/base/file/uptokens?type=' + type,
        data: '',
        headers: _headers
    });
}

/**
 * [getPages 获取页面数据]
 * @param  {[type]} sceneId [description]
 * @return {[type]}         [description]
 */
function getPages(sceneId) {
	var url = serverHost + 'm/scene/pages/' + sceneId;
	return request.get({
		url: url,
		headers: _headers
	});
}

function getViewData(sceneId, sceneCode) {
	var url = s1Host + 'eqs/page/'+sceneId+'?code='+sceneCode;
	return request.get({url: url});
}