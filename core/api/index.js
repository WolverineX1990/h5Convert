var Scene = require('./../scene');
var Rabbitpre = require('./../rabbitpre');
var EqxUser = require('./../user/eqxUser');
var eqxConfig = require('./../config');
var sceneService = require('./../scene/services');
var makaConfig = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var makaService = require('./../maka/service');

function rabToEqx(url) {
	var eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	var rabbitpre = new Rabbitpre(url);
	return rabbitpre.loadData().then(res=>eqxUser.login().then(loginSuccess));

	function loginSuccess() {
		sceneService.setHeaders({Origin: eqxConfig.eqxOrigin, cookie: eqxUser.cookie});
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

function eqxToMaka(url) {
	var user = new MakaUser(makaConfig.userName, makaConfig.userPwd);
	var scene = new Scene(url);
	scene.loadData().then(res=>console.log(scene.pages));
}

module.exports = {
	rabToEqx: rabToEqx,
	eqxToMaka: eqxToMaka
}