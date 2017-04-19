var config = require('./../core/config').maka;
var Scene = require('./../core/scene');
var makaUpload = require('./makaUpload');

function loginSuccess(res) {
	makaService.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});	
	makaService.createTemplate().then(res1=>{
		var code = res1.split('=')[1];
		makaService.getTemplate(code).then(res2=>{
			var json = JSON.parse(res2).data;
			var maka = new Maka(json);
			maka.user = user;
			maka.getJson().then(res3=> {
				scene.toMaka(maka).then(res4=>console.log('success'));
			});
		});
	});
}
scene.loadData().then(res=>user.login().then(loginSuccess));
// 
// makaUpload();