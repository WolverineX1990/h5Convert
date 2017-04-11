'use strict';
var sign = require('./../core/maka/sign');
function test() {
	var token = {
		"accessKeyId": "STS.LXh2fet7VqXDLTrPN7qNxLr74",
		"secretAccessKey": "CwQEKyLv9JfA6ZLTfakdT1gSFisn5jUDckCZai2UsxMN",
		"securityToken": "CAISwwJ1q6Ft5B2yfSjIrZvdedzRmeh3xpqvTnLDtE5ifcFUo7ec1jz2IHBLdHltBewdsvU/lGtV6Pcdlq4oGsYYHhSZNWfCUxaKslHPWZHInuDox05t6vT8a5T6aXPS2MvVfJ+nLrf0ceusbFbpjzJ6xaCAGxypQ12iN+//6/tgdc9FcQSkSjBECdxKRG5ls9RIDWbNEvyvPxX2+FGyanBloQ1hk2hyxL2iy8mHkHrkgUb91/UeqvauQMWtZNI+O4xkAZXnhbcmLfOZjHEBsEMSpPws0/5B8DTOptCWH0RL7lKbKOfOtYY+dVIiPvV9WYw89aOszqQg5rOCzN+vm00XYts4CXqPGNqSp+LfA/6sO9oDcrL2Bm/AyNjnNOOu41x0MS9HaFgWKopxcSIuWEM2LjbBMeq85EuPbBqnT7hKYVixa0+npRqAARMnwj8x1oN67WhjoYr8KptO80MkIH6BJa4KIXN5iIkRhqVVfLtAOxHHe9oq/zlhRFXsRyhlIbC2rx/O9uEPVRGGOycvCZLExnsh9UhLhpe+yiSJPU425d9EUbiOq5MVQWtv+Z4l3P4pFmz7AEYAHdrTUi5wvkwJoFqjmMf8iDXi"
	};
	var header = {
		'method': 'PUT',
		'Content-MD5': 'db5L/shPcEtTJGzpPO3s2w==',
		'Content-Type': 'image/jpeg',
		'x-oss-date': 'Tue, 11 Apr 2017 13:08:34 GMT',
		'x-oss-security-token': '',
		'x-sdk-client': ''
	};
	var path = '';
	var signature = sign(token, header, path);
	console.log(signature);
}

module.exports = test;