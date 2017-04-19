var config = require('./../core/config').rabbit;
var Scene = require('./../core/scene');
var makaUpload = require('./makaUpload');
var RabbitUser = require('./../core/user/rabbitUser');
var rabSevice = require('./../core/rabbit/service')

var user = new RabbitUser(config.userName, config.userPwd);

user.login().then(loginSuccess);

function loginSuccess(res) {
	rabSevice.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie,
		Referer: 'http://www.rabbitpre.com/profile.html'
	});
	var data = {
		data: {
			name: 'test'
		},
		isAjax: true
	};
	rabSevice.test3().then(res=>{
		console.log(res);
	})
	// rabSevice.test().then(res=>{
	// 	user.cookie.push(res.cookie[0]);
	// 	rabSevice.test2().then(res=>{
	// 		console.log(res);
	// 		// rabSevice.createTemplate(data).then(res=>console.log(res));
	// 	});
	// });
}
// scene.loadData().then(res=>user.login().then(loginSuccess));
// 
// makaUpload();