'use strict';
var sign = require('./../core/maka/sign');
var crypto = require('./../core/utils').crypto;
function test(token, imgRes, resource) {
	var credentials = token.token.Credentials;
	var ContentMD5 = crypto.md5(imgRes, 'base64');
	var header = {
		'method': 'PUT',
		'Content-MD5': ContentMD5,
		'Content-Type': 'image/jpeg',
		'x-oss-date': (new Date()).toUTCString(),
		'x-oss-security-token': credentials.SecurityToken,
		'x-sdk-client': ''
	};
	var signature = sign(credentials, header, resource);
	var auth = 'OSS ' + credentials.AccessKeyId + ':' + signature;
	header.Authorization = auth;
	return header;
}

module.exports = test;