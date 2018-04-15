var uploader = require('./../core/scene/uploader');
var services = require('./../core/scene/services');
var User = require('./../core/user/eqxUser');
var config = require('./../core/config').eqx;


function test() {
	var user = new User(config.eqxName, config.eqxPwd);
	var imageToken;
	var url = 'http://cdn3.rabbitpre.com/d24fb47c-376d-49a3-b08c-d403ccf1076d-1462?imageMogr2/quality/70/auto-orient';
	user.login()
		.then(()=>services.setHeaders({Origin: config.eqxOrigin, cookie: user.cookie}))
		.then(()=>services.getUpToken('image'))
		.then(res=>imageToken = JSON.parse(res).map.token)
		.then(()=>uploader.getBase64(url))
		.then(res=>uploader.upload(res, imageToken))
		.then(res=>console.log(res));
}

module.exports = test;