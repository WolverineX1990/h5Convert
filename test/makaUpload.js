var config = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var makaService = require('./../core/maka/service');
var user = new MakaUser(config.userName, config.userPwd);
var json = require('./maka.json');
var URL = require('url');
var sign = require('./../core/maka/sign');
var utils = require('./../core/utils');
var crypto = utils.crypto;
var randomStr = utils.randomStr;

function loginSuccess() {
	makaService.getOssSts2(user.info.token).then(res => {
		var ossSts2 = JSON.parse(res).data;
		var string = JSON.stringify(json);
		var binary = new Buffer(string, 'utf8');
		var path = '/' + ossSts2.uploadPath +'template/fff/'+ randomStr() +'.json';
		var resource = '/' + ossSts2.bucket + path;
		var header = getOssHeader(ossSts2, binary, resource, 'text/json');
		header.CacheControl = 'public';
		var param = URL.parse(ossSts2.hostId);
		var url = param.protocol + '//' + ossSts2.bucket + '.' + param.host + path;
		console.log(url);
		makaService.upload(url, binary, header);
	});
}

function getOssHeader(token, data, resource, contentType) {
	var credentials = token.token.Credentials;
	var ContentMD5 = crypto.md5(data, 'base64');
	var header = {
		'method': 'PUT',
		'Content-MD5': ContentMD5,
		'Content-Type': contentType,
		'x-oss-date': (new Date()).toUTCString(),
		'x-oss-security-token': credentials.SecurityToken,
		'x-sdk-client': ''
	};
	var signature = sign(credentials, header, resource);
	var auth = 'OSS ' + credentials.AccessKeyId + ':' + signature;
	header.Authorization = auth;
	return header;
}

function test() {
	user.login().then(loginSuccess);	
}

module.exports = test;