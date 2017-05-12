var config = require('./../core/config').rabbit;
var rabUpload = require('./rabUpload');
var RabbitUser = require('./../core/user/rabbitUser');
var rabSevice = require('./../core/rabbit/service');
var Rabbit = require('./../core/rabbit');

var user = new RabbitUser(config.userName, config.userPwd);
function loginSuccess(res) {
	rabSevice.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});
	user.getSession().then(res=>{
		rabSevice.getUserInfo({'x-jwt-token': user.info.token}).then(res=>{
			rabSevice.setHeaders({
				Origin: config.origin, 
				cookie: res.cookie
			});
			var id = '3147dda6-eb93-4388-b15f-c10ce42c2d9a';
			rabSevice.getTplData(id).then(res=>{
				var json = JSON.parse(res).data;
				// json.gather = '{"id":0,"strict":{"1375595490":"手机","3639691088":"电话","3790068711":"购买意向"}}'
				var pages = json.pages;
				for(var i=0;i<pages.length;i++) {
					var cmps = pages[i].cmps;
					for(var j = 0;j<cmps.length;j++) {
						if(cmps[j].tid == 3707000490) {
							console.log(cmps[j].cmpType);
							cmps[j].text = '<div style="background-color: rgb(196, 67, 60);border-radius: 9px;">立即访问</div>'
						}
					}
				}
				var data = {
					data: JSON.stringify(json),
					isAjax: true
				};
				rabSevice.createTemplate(data).then(res=>console.log('sucess!'));
			});
		});
	});
}

function update() {
	user.login().then(loginSuccess);
}

module.exports = update;