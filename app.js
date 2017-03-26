var Scene = require('./scene');
var Rabbitpre = require('./rabbitpre');
var EqxUser = require('./user/eqxUser');
var config = require('./config');
var sceneService = require('./scene/services');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/1aa3510f-f9b7-4085-883d-1b11f5cb6ea0?mobile=1';
// http://www.rabbitpre.com/template/preview/1177f127-aca7-4c2f-b6c8-7dca3bd1426a?mobile=1
// http://www.rabbitpre.com/template/preview/e645e8c6-1756-4eb0-9de6-72774f95e830?mobile=1

var eqxUser = new EqxUser(config.eqxName, config.eqxPwd);
var rabbitpre = new Rabbitpre(rabbitpreUrl);
try{
	rabbitpre.loadData().then(loadSuccess);
} catch(err) {
	console.log(err);
}

function loadSuccess() {
	eqxUser.login().then(loginSuccess);
}

function loginSuccess() {
	sceneService.setHeaders({Origin: config.eqxOrigin, cookie: eqxUser.cookie});
	sceneService.createScene().then(res=> {
		var sceneId = JSON.parse(res).obj;
		sceneService.getSceneDetail(sceneId).then(res1 => {
			var json = JSON.parse(res1).obj;
			var scene = new Scene(json);
			scene.user = eqxUser;
			rabbitpre.toScene(scene).then(res2=>console.log('convert success'));
		});
	});
}
// 
// 写一个http 拦截器，所有错误的拦截