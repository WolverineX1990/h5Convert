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
// user.login().then(res=>{
// 	for(var i = 0;i<user.cookie.length;i++) {
// 		var cookie = user.cookie[i];
// 		if(cookie.indexOf('Makauid=deleted') > -1 || cookie.indexOf('token=deleted') > -1) {
// 			user.cookie.splice(i, 1);
// 			i--;
// 		}
// 		// var reg = /Makauid=([\d]+);/
// 		// if(reg.test(cookie)) {
// 		// 	console.log(cookie.match(reg)[1]);
// 		// }
// 	}
// 	user.cookie.push('gr_user_id=e62d4ae3-6869-4a76-9ea3-74df685eb0bf; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/')
// 	console.log(user.cookie);
// 	makaService.setHeaders({
// 		Origin: config.origin, 
// 		cookie: user.cookie,
// 		Referer: 'http://maka.im/designer/projects'
// 	});
// 	makaService.createScene().then(res=>console.log(res));
// 	// makaService.template('T_T53RBCYY').then(res=>console.log(res));
// 	// makaService.test().then(res=>console.log(res), res1=>console.log(res1));
// });
user.cookie=[
	'gr_user_id=e62d4ae3-6869-4a76-9ea3-74df685eb0bf; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/',
	'token=451d5debc23a2daee0ef33cd399699c5; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/',
	'gr_session_id_0c7e997301c76a237108050bc47ad282=70a45f2b-8796-4d09-8c90-4032f8bc5dd5; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/',
	'gr_cs1_70a45f2b-8796-4d09-8c90-4032f8bc5dd5=uid:3915305; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/',
	'Makauid=3915305; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/',
	'Hm_lvt_7166ea0e3a55fb0ffa59dcc17813fa99=1491381033; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/',
	'Hm_lpvt_7166ea0e3a55fb0ffa59dcc17813fa99=1491381033; expires=Fri, 05-May-2017 10:07:15 GMT; Max-Age=2592000; path=/'
	];
// console.log(user.cookie);
makaService.setHeaders({
	Origin: config.origin, 
	cookie: user.cookie,
	Referer: 'http://maka.im/designer/projects',
	Pragma: 'no-cache'
});
makaService.createScene().then(res=>console.log(res));