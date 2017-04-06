// var uploader = require('./../core/scene/uploader');
// var reg = /viewBox="([\s|\d]*)"/
// uploader.getSvg('http://res1.eqh5.com/FsxVqjDrfF5mHFvcyFePqHGXKA5C').then(function(res) {
// 	var result = res.match(reg)[1];
// 	var arr = result.split(' ');
// 	console.log(arr);
// });

var config = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var user = new MakaUser(config.userName, config.userPwd);
var makaService = require('./../core/maka/service');
var Scene = require('./../core/scene');
var scene = new Scene('http://h5.eqxiu.com/s/mPRgdwxR');
scene.loadData().then(res=>console.log(scene.pages));
// user.login().then(res=>{
// 	makaService.setHeaders({
// 		Origin: config.origin, 
// 		cookie: user.cookie
// 	});
// 	makaService.createScene().then(res=>console.log(res));
// 	// makaService.template('T_T53RBCYY').then(res=>console.log(res));
// });