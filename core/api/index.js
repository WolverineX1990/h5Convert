var Scene = require('./../scene');
var Rabbitpre = require('./../rabbitpre');
var EqxUser = require('./../user/eqxUser');
var config = require('./../config');
var sceneService = require('./../scene/services');

function rabToEqx(url) {
	var eqxUser = new EqxUser(config.eqxName, config.eqxPwd);
	var rabbitpre = new Rabbitpre(url);
	return rabbitpre.loadData().then(res=>eqxUser.login().then(loginSuccess));

	function loginSuccess() {
		sceneService.setHeaders({Origin: config.eqxOrigin, cookie: eqxUser.cookie});
		return sceneService.createScene().then(res=> {
			var sceneId = JSON.parse(res).obj;
			return sceneService.getSceneDetail(sceneId).then(res1 => {
				var json = JSON.parse(res1).obj;
				var scene = new Scene(json);
				scene.user = eqxUser;
			 	return rabbitpre.toScene(scene);
			});
		});
	}
}

module.exports = {
	rabToEqx: rabToEqx
}