var crypto = require('./../core/utils/crypto');
function test(argument) {
	console.log(crypto.md5('1','base64'));
}

module.exports = test;