var Scene = require('./../scene');
var Rabbitpre = require('./../rabbitpre');
var EqxUser = require('./../user/eqxUser');
var config = require('./../config');
var eqxConfig = config.eqx;
var sceneService = require('./../scene/services');
var makaConfig = config.maka;
var MakaUser = require('./../user/makaUser');
var makaService = require('./../maka/service');
var Maka = require('./../maka');

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
	return scene.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		makaService.setHeaders({
			Origin: makaConfig.origin, 
			cookie: user.cookie
		});	
		return makaService.createTemplate().then(res1=>{
			var code = res1.split('=')[1];
			return makaService.getTemplate(code).then(res2=>{
				var json = JSON.parse(res2).data;
				var maka = new Maka(json);
				maka.user = user;
				return maka.getJson().then(()=>scene.toMaka(maka));
			});
		});
	}
}

module.exports = {
	rabToEqx: rabToEqx,
	eqxToMaka: eqxToMaka
}