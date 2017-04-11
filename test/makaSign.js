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
	var arr = ["PUT","22AgwBG4ncftPnqbbxTb5Q==","image/jpeg","Tue, 11 Apr 2017 10:15:01 GMT","x-oss-date:Tue, 11 Apr 2017 10:15:01 GMT","x-oss-security-token:CAISwwJ1q6Ft5B2yfSjIraraO/3Cm4l3hrCnZ1HZ0FpkVM1mro+dqDz2IHBLdHltBewdsvU/lGtV6Pcdlq4oGsYYHhSZNV+5QBmKslHPWZHInuDox05t6vT8a5T6aXPS2MvVfJ+nLrf0ceusbFbpjzJ6xaCAGxypQ12iN+//6/tgdc9FcQSkSjBECdxKRG5ls9RIDWbNEvyvPxX2+FGyanBloQ1hk2hyxL2iy8mHkHrkgUb91/UeqvauQMWtZNI+O4xkAZXnhbcmLfOZjHEBsEMSpPws0/5B8DTOptCWH0RL7lKbKOfOtYY+dVIiPvV9WYw89aOszqQg5rOCzN+vm00XYts4CXqPGNqSp+LfA/6sO9oDcrL2Bm/AyNjnNOOu41x0MS9HaFgWKopxcSIuWEM2LjbBMeq85EuPbBqnT7hKYVixa0+npRqAAQ3boHvlboIS3M2EyVoi+UmpnFwRighlszaRh4fz+7wJbEZydav11AjJGBB0z155mQF0JaTOZyjX26Vh+Xbst7MqpF08WuL3JSKtr5Ia1sBjnVChViVhmXG3ptRGl3lc4fOBuxc4cPg+KQTWteA+8cvEqn7i1AG401nNQw83Iaiy","/makapicture/user/3915305/images/205462a7ae2c6f78286fc85571828f2f.jpg"];
	var secret = 'BBpiPuScYpqwrUdZN8sGEgpDU4Cz7kj8XEPddq7VNKMR';
	var string = arr.join('\n');

	var hmac = crypto.createHmac('sha1', secret);
	hmac.update(string);
	var tt = hmac.digest('base64');
	console.log(tt);
}
//crypto.hmac

module.exports = test;