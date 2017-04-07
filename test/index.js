var config = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var makaService = require('./../core/maka/service');
var Maka = require('./../core/maka');
var Scene = require('./../core/scene');

var user = new MakaUser(config.userName, config.userPwd);
var scene = new Scene('http://h5.eqxiu.com/s/mPRgdwxR');


function loginSuccess(res) {
	makaService.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});
	makaService.createScene().then(res1=>{
		var json = JSON.parse(res1).data;
		var maka = new Maka(json);
		maka.user = user;
	 	return scene.toMaka(maka);
	});
}
scene.loadData().then(res=>user.login().then(loginSuccess));