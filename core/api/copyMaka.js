var config = require('./../config');
var makaConfig = config.maka;
var Maka = require('./../maka');
var makaService = require('./../maka/service');
var MakaUser = require('./../user/makaUser');

function copyMaka(url) {
	var user = new MakaUser(makaConfig.userName, makaConfig.userPwd);
	var oriMaka = new Maka(url);
	return oriMaka.loadData().then(res=>user.login().then(loginSuccess));

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
				return maka.copy();
			});
		});
	}
}

module.exports = copyMaka;