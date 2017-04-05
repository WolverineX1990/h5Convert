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
user.login().then(res=>{
	for(var i = 0;i<user.cookie.length;i++) {
		var cookie = user.cookie[i];
		if(cookie.indexOf('Makauid=deleted') > -1 || cookie.indexOf('token=deleted') > -1) {
			user.cookie.splice(i, 1);
			i--;
		}
		// var reg = /Makauid=([\d]+);/
		// if(reg.test(cookie)) {
		// 	console.log(cookie.match(reg)[1]);
		// }
	}
	// console.log(user.cookie);
	makaService.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie,
		Referer: 'http://maka.im/designer/projects'
	});
	makaService.createScene().then(res=>console.log(res));
	// makaService.template('T_T53RBCYY').then(res=>console.log(res));
	// makaService.test().then(res=>console.log(res), res1=>console.log(res1));
});