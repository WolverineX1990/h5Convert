var config = require('./../config');

var eqxConfig = config.eqx;
var Scene = require('./../scene');
var sceneService = require('./../scene/services');
var EqxUser = require('./../user/eqxUser');
var Rabbit = require('./../rabbit');

function rabToEqx(url) {
	var eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	var rabbit = new Rabbit(url);
	return rabbit.loadData().then(res=>eqxUser.login().then(loginSuccess));

	function loginSuccess() {
		sceneService.setHeaders({Origin: eqxConfig.eqxOrigin, cookie: eqxUser.cookie});
		return sceneService.createScene().then(res=> {
			var sceneId = JSON.parse(res).obj;
			return sceneService.getSceneDetail(sceneId).then(res1 => {
				var json = JSON.parse(res1).obj;
				var scene = new Scene(json);
				scene.user = eqxUser;
			 	return rabbit.toScene(scene);
			});
		});
	}
}

module.exports = rabToEqx;