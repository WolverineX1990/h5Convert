var config = require('./../config');
var eqxConfig = config.eqx;
var Scene = require('./../scene');
var sceneService = require('./../scene/services');
var EqxUser = require('./../user/eqxUser');
var Rabbit = require('./../rabbit');
var utils = require('./../utils');

function rabToEqx(url) {
	var eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	var rabbit = new Rabbit(url);
	return rabbit.loadData().then(res=>eqxUser.login())
				.then(res=>utils.checkExist('rab-eqx-' + rabbit.data.id))
				.then(res=>{
					sceneService.setHeaders({Origin: eqxConfig.eqxOrigin, cookie: eqxUser.cookie});
					return sceneService.createScene();
				})
				.then(res=>{
					var sceneId = JSON.parse(res).obj;
					return sceneService.getSceneDetail(sceneId);
				})
				.then(res=>{
					var json = JSON.parse(res).obj;
					var scene = new Scene(json);
					scene.user = eqxUser;
				 	return rabbit.toScene(scene);
				 })
				.then(res=>db.put('rab-eqx-' + rabbit.data.id, url));
}

module.exports = rabToEqx;