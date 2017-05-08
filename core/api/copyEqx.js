var config = require('./../config');

var eqxConfig = config.eqx;
var Scene = require('./../scene');
var sceneService = require('./../scene/services');
var EqxUser = require('./../user/eqxUser');

function copyEqx(url) {
	var eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	var oriScene = new Scene(url);
	return oriScene.loadData().then(res=>eqxUser.login().then(loginSuccess));

	function loginSuccess() {
		sceneService.setHeaders({Origin: eqxConfig.eqxOrigin, cookie: eqxUser.cookie});
		return sceneService.createScene().then(res=> {
			var sceneId = JSON.parse(res).obj;
			return sceneService.getSceneDetail(sceneId).then(res1 => {
				var json = JSON.parse(res1).obj;
				var originData = oriScene.data;
				json.bgAudio = JSON.stringify(originData.bgAudio);
				json.property = JSON.stringify(originData.property);
				json.name = originData.name;
				json.cover = originData.cover;
				json.description = originData.description;
				json.pageMode = originData.pageMode;
				var scene = new Scene(json);
				scene.user = eqxUser;
			 	return scene.copy(oriScene.pages);
			});
		});
	}
}

module.exports = copyEqx;