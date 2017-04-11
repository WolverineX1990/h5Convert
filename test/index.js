var config = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var makaService = require('./../core/maka/service');
var Maka = require('./../core/maka');
var Scene = require('./../core/scene');
var URL = require('url');
var utils = require('./../core/utils');
var makaSign = require('./makaSign');

makaSign();

var user = new MakaUser(config.userName, config.userPwd);
// var scene = new Scene('http://h5.eqxiu.com/s/mPRgdwxR');
var url = 'http://res1.eqh5.com/FvXOVJLfGWczxkeFM-5VFC98tyEn?imageMogr2/thumbnail/479x479%3E/strip';
function loginSuccess(res) {
	makaService.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});
	makaService.getOssConfig(user.info.token).then(res => {
		var token = JSON.parse(res).data;//OSS STS.HwaChDauYiAtXnrWrd1mf8CFP:VSgLe3q+/wXz+cEOKQ2fgyxHDok=
		console.log(token);
		var signature = sign(credentials.SecretAccessKey, this.stringToSign());
		var auth = 'OSS ' + token.Credentials.AccessKeyId + ':' + signature;
		// utils.getBase64(url).then(res=>{
		// 	var param = URL.parse(token.hostId);
		// 	var path = param.protocol + '//' + token.bucket + '.' + param.host + '/images/' + 'mmmmm.jpg';
		// 	console.log(path);
		// 	makaService.upload(path, res).then(res=>console.log(1));
		// });		
	});
	
	// makaService.createScene().then(res1=>{
	// 	var json = JSON.parse(res1).data;
	// 	var maka = new Maka(json);
	// 	maka.user = user;
	//  	return scene.toMaka(maka);
	// });
}
// user.login().then(loginSuccess);
// scene.loadData().then(res=>user.login().then(loginSuccess));