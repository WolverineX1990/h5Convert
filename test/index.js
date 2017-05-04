var config = require('./../core/config').rabbit;
var Scene = require('./../core/scene');
var makaUpload = require('./makaUpload');
var rabUpload = require('./rabUpload');
var RabbitUser = require('./../core/user/rabbitUser');
var rabSevice = require('./../core/rabbit/service');
var Rabbit = require('./../core/rabbit');

var user = new RabbitUser(config.userName, config.userPwd);
var json = '{"name":"未命名","tags":"","userid":null,"desc":null,"imgurl":null,"shorturl":null,"imgPath":null,"state":null,"statetime":null,"showviewcount":true,"music_is_auto":1,"timeinterval":0,"comment":0,"logo":null,"logoPath":null,"level":null,"music":null,"musicname":null,"device":"iPhone 5","width":320,"height":504,"in":null,"out":null,"loop":null,"company":null,"link":null,"publish":0,"switch_guide":true,"gather":null,"app_url":null,"templateid":null,"pages":[{"id":null,"row":0,"col":0,"in":null,"out":null,"bgcol":null,"bgimage":null,"bgserver":null,"bgleft":0,"bgtop":0,"cmps":"[]"}]}';
function loginSuccess(res) {
	rabSevice.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});
	var data = {
		data: json,
		isAjax: true
	};
	user.getSession().then(res=>{
		rabSevice.getUserInfo({'x-jwt-token': user.info.token}).then(res=>{
			rabSevice.setHeaders({
				Origin: config.origin, 
				cookie: res.cookie
			});
			// rabSevice.test().then(res=>{
			// 	var json = JSON.parse(res).data;
			// 	var pages = json.pages;
			// 	for(var i=0;i<pages.length;i++) {
			// 		var cmps = pages[i].cmps;
			// 		for(var j = 0;j<cmps.length;j++) {
			// 			if(cmps[j].cmpType == 'shape') {
			// 				if(cmps[j].src == 'http://tenc1.rabbitpre.com/b933779f-1314-4d35-8775-fb978cb9b768') {
			// 					cmps[j].src = 'http://wscdn.rabbitpre.com/3fe3893e-11fb-474b-b501-c753e922a3a0-3161'
			// 					console.log(j)
			// 				}
			// 			}
			// 		}
			// 	}
			// 	var data = {
			// 		data: JSON.stringify(json),
			// 		isAjax: true
			// 	};
			// 	rabSevice.createTemplate(data).then(res=>console.log(res));
			// });
			rabSevice.createTemplate(data).then(res=>{
				var json = JSON.parse(res);
				var rabbit = new Rabbit(json);
				scene.toRabbit(rabbit).then(res=>console.log('cover success!'));
			});
		});
	});
}
// var scene = new Scene('http://h5.eqxiu.com/s/U3srOsDl');
var scene = new Scene('http://h5.eqxiu.com/s//TTrPggim');
scene.loadData().then(res=>user.login().then(loginSuccess));
// user.login().then(loginSuccess);
// 
// makaUpload();
// rabUpload();