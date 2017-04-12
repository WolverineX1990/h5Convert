var utils = require('./../utils');
var crypto = utils.crypto;

function sign(token, headers, resource) {
    var string = stringToSign(headers, resource);
    var signature = crypto.hmac(token.AccessKeySecret, string, 'base64', 'sha1');
	return signature;
}

function stringToSign(headers, resource) {
	var parts = [];
	parts.push(headers.method);
	parts.push(headers['Content-MD5'] || '');
	parts.push(headers['Content-Type'] || '');
	parts.push(headers['presigned-expires'] || headers['x-oss-date'] || headers['Date'] || '');
	parts.push(canonicalizedHeaders(headers));
    parts.push(resource);
	return parts.join('\n');
}

function canonicalizedHeaders(headers) {
    var arr = [];
    utils.each(headers, function(name) {
        if (name.match(/^x-oss-/)){
            arr.push(name);
        }
    });
    arr.sort(function(a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });
    var parts = [];
    arr.forEach(function(name) {
        parts.push(name.toLowerCase() + ':' + headers[name]);
    });
    return parts.join('\n');
}

module.exports = sign;