var utils = require('./../utils');

function sign(token, headers) {
	var signature = sha1(token.SecretAccessKey, stringToSign(headers, path));
	var auth = 'OSS ' + token.AccessKeyId + ':' + signature;
	return auth;
}

function sha1(key, sign) {

	return '';
}

function stringToSign(headers, path) {
	var parts = [];
	parts.push(headers.method);
	parts.push(headers['Content-MD5'] || '');
	parts.push(headers['Content-Type'] || '');
	parts.push(headers['presigned-expires'] || headers['x-oss-date'] || headers['Date'] || '');
	parts.push(path);
	return parts.join('\n');
}

module.exports = sign;