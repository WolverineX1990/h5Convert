/**
 * [_crypto 加密]
 * @type {[type]}
 */
var _crypto = require('crypto');

var crypto = {};

crypto.md5 = function (data, digest) {
	var md5 = _crypto.createHash('md5');
	md5.update(data);
	return md5.digest(digest);
};

crypto.hmac = function(key, string, digest, fn) {
	var hmac = _crypto.createHmac(fn, key);
	hmac.update(string);
	return hmac.digest(digest);
};

module.exports = crypto;