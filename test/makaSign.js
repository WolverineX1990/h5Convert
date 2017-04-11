'use strict';
var sign = require('./../core/maka/sign');
var crypto = require('crypto');
function test() {
	var token = {
		"accessKeyId": "STS.DqUMpZSZpFTkCSHEX8DWzzaao",
		"secretAccessKey": "Dreq4i6nQnc1M8NjNcdhNfbC38TxbQQXjPGfgLVCahFJ",
		"securityToken": "CAISwwJ1q6Ft5B2yfSjIpbLgBsruvoVR8ZaAQXX5oVhtSNhWlaTKjTz2IHBLdHltBewdsvU/lGtV6Pcdlq4oGsYYHhSZNWOOJB2KslHPWZHInuDox05t6vT8a5T6aXPS2MvVfJ+nLrf0ceusbFbpjzJ6xaCAGxypQ12iN+//6/tgdc9FcQSkSjBECdxKRG5ls9RIDWbNEvyvPxX2+FGyanBloQ1hk2hyxL2iy8mHkHrkgUb91/UeqvauQMWtZNI+O4xkAZXnhbcmLfOZjHEBsEMSpPws0/5B8DTOptCWH0RL7lKbKOfOtYY+dVIiPvV9WYw89aOszqQg5rOCzN+vm00XYts4CXqPGNqSp+LfA/6sO9oDcrL2Bm/AyNjnNOOu41x0MS9HaFgWKopxcSIuWEM2LjbBMeq85EuPbBqnT7hKYVixa0+npRqAAR7XyLOGdnHR2EXNF50oYgvB5p/XNxtrU4AvtEI0XSm4R4ZpMJHiaZFw5POrgH7GqFKDk+XMjFexF6Z9ys5dIVtFOw8crPKncAjxWMLaK3gymL9B+XmMv3PPjgVzs67ibmhe0givE4H0wqjiUQ2d8YfoVvI4rw2gU/wpVTAjSG8r"
	};
	// var header = {
	// 	'method': 'PUT',
	// 	'Content-MD5': '',
	// 	'Content-Type': '',
	// 	'x-oss-date': ''
	// };
	// var path = '';
	// var signature = sign(token, header, path);
	// console.log(signature);
	

	var hmac = crypto.createHmac('sha1', app_secret);
	hmac.update('foo');
	hmac.digest('hex');
}
//crypto.hmac

module.exports = test;