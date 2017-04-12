var config = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var makaService = require('./../core/maka/service');
var Maka = require('./../core/maka');
var Scene = require('./../core/scene');
var URL = require('url');
var utils = require('./../core/utils');
var makaSign = require('./makaSign');

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


makaService.getOssSts2(user.info.token).then(res => {
	var token = JSON.parse(res).data;
	utils.getResource(url).then(res=>{
		var binary = new Buffer(res, 'binary');
		var path = '/' + token.uploadPath +'images/' + utils.randomStr() +'.jpg';
		var resource = '/' + token.bucket + path;
		var header = makaSign(token, binary, resource);
		var param = URL.parse(token.hostId);
		var url = param.protocol + '//' + token.bucket + '.' + param.host + path;
		console.log(url);
		makaService.upload(url, binary, header).then(res=>console.log(1));
	});
});