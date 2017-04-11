var utils = require('./../utils');
var crypto = require('crypto');

function sign(token, headers, path) {
	var hmac = crypto.createHmac('sha1', token.SecretAccessKey);
	hmac.update(stringToSign(headers, path));
	var signature = hmac.digest('base64');
	var auth = 'OSS ' + token.AccessKeyId + ':' + signature;
	return auth;
}


function stringToSign(headers, path) {
	var parts = [];
	parts.push(headers.method);
	parts.push(headers['Content-MD5'] || '');
	parts.push(headers['Content-Type'] || '');
	parts.push(headers['presigned-expires'] || headers['x-oss-date'] || headers['Date'] || '');
	parts.push(canonicalizedHeaders(headers));
	return parts.join('\n');
}

function canonicalizedHeaders(headers) {
    var arr = [];
    utils.each(headers, function(name) {
        if (name.match(/^x-oss-/i))
            arr.push(name);
    });
    arr.sort(function(a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });
    var parts = [];
    utils.each(headers, function(name) {
        parts.push(name.toLowerCase() + ':' + String(headers[name]));
    });
    return parts.join('\n');
}

module.exports = sign;