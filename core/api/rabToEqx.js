var config = require('./../config');
var eqxConfig = config.eqx;
var Scene = require('./../scene');
var sceneService = require('./../scene/services');
var EqxUser = require('./../user/eqxUser');
var Rabbit = require('./../rabbit');
var logger = require('./../logger');

function rabToEqx(url) {
	// type 2
	var reg = /preview\/([^?]+)/;	
	var key = url.match(reg)[1];
	var eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	var rabbit = new Rabbit(url);
	return rabbit.loadData().then(res=>eqxUser.login())
				// .then(res=>logger.checkExist(key, 2))
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
				// .then(res=>logger.insert(key, 2, url))
				// .then(res=>logger.close());
}

module.exports = rabToEqx;