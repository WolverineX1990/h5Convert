var config = require('./../core/config').rabbit;
var Scene = require('./../core/scene');
var makaUpload = require('./makaUpload');
var rabUpload = require('./rabUpload');
var RabbitUser = require('./../core/user/rabbitUser');
var rabSevice = require('./../core/rabbit/service');

var user = new RabbitUser(config.userName, config.userPwd);
// user.login().then(loginSuccess);
var json = '{"name":"未命名","tags":"","userid":null,"desc":null,"imgurl":null,"shorturl":null,"imgPath":null,"state":null,"statetime":null,"showviewcount":true,"music_is_auto":1,"timeinterval":0,"comment":0,"logo":null,"logoPath":null,"level":null,"music":null,"musicname":null,"device":"iPhone 5","width":320,"height":504,"in":null,"out":null,"loop":null,"company":null,"link":null,"publish":0,"switch_guide":true,"gather":null,"app_url":null,"templateid":null,"pages":[{"id":null,"row":0,"col":0,"in":null,"out":null,"bgcol":null,"bgimage":null,"bgserver":null,"bgleft":0,"bgtop":0,"cmps":"[]"}]}'
function loginSuccess(res) {
	rabSevice.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});
	var data = {
		data: json,//JSON.parse(json),
		isAjax: true
	};
	user.getSession().then(res=>{
		rabSevice.getUserInfo({'x-jwt-token': user.info.token}).then(res=>{
			rabSevice.setHeaders({
				Origin: config.origin, 
				cookie: res.cookie
			});
			rabSevice.createTemplate(data).then(res=>console.log(res));
		});
	});
	// rabSevice.test().then(res=>{
	// 	user.cookie.push(res.cookie[0]);
	// 	rabSevice.test2().then(res=>{
	// 		console.log(res);
			// rabSevice.createTemplate(data).then(res=>console.log(res));
	// 	});
	// });
}
scene.loadData().then(res=>user.login().then(loginSuccess));
// 
// makaUpload();
// rabUpload();