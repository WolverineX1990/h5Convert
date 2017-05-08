var config = require('./../config');
var Scene = require('./../scene');
var makaConfig = config.maka;
var Maka = require('./../maka');
var makaService = require('./../maka/service');
var MakaUser = require('./../user/makaUser');

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

module.exports = eqxToMaka;