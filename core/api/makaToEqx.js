var config = require('./../config');
var Maka = require('./../maka');
var eqxConfig = config.eqx;
var Scene = require('./../scene');
var sceneService = require('./../scene/services');
var EqxUser = require('./../user/eqxUser');

function makaToEqx(url) {
	var eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	var maka = new Maka(url);
	return maka.loadData().then(res=>eqxUser.login().then(loginSuccess));

	function loginSuccess(res) {
		sceneService.setHeaders({Origin: eqxConfig.eqxOrigin, cookie: eqxUser.cookie});
		return sceneService.createScene().then(res=> {
			var sceneId = JSON.parse(res).obj;
			return sceneService.getSceneDetail(sceneId).then(res1 => {
				var json = JSON.parse(res1).obj;
				var scene = new Scene(json);
				scene.user = eqxUser;
			 	return maka.toScene(scene);
			});
		});
	}
}

module.exports = makaToEqx;