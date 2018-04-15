var config = require('./../config');
var Maka = require('./../maka');
var rabConfig = config.rabbit;
var Rabbit = require('./../rabbit');
var RabbitUser = require('./../user/rabbitUser');
var rabbitSevice = require('./../rabbit/service');
// var logger = require('./../logger');

function makaToRabbit(url) {
	var user = new RabbitUser(rabConfig.userName, rabConfig.userPwd);
	var maka = new Maka(url);
	var json = '{"name":"兔展一页作品","desc":"这是我制作的兔展一页作品，快来看看！","height":504,"width":320,"imgurl_path":"https://oss3.rabbitpre.com/spa/default.png","templateid":"","imgurl":"","pages":[{"bgcol":"#fff","bgimage":null,"col":1000,"cmps":"[]"}],"app_material":""}';
	return maka.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		rabbitSevice.setHeaders({
			Origin: rabConfig.origin, 
			cookie: user.cookie
		});
		var data = {
			data: json,
			isAjax: true
		};
		return user.getSession().then(res=>{
			return rabbitSevice.getUserInfo({'x-jwt-token': user.info.token}).then(res=>{
				rabbitSevice.setHeaders({
					Origin: rabConfig.origin, 
					cookie: res.cookie
				});
				return rabbitSevice.createPoster(data).then(res=>{
					var json = JSON.parse(res).result;
					var rabbit = new Rabbit(json);
					return maka.toRabbitPoster(rabbit);
				});
			});
		});
	}
}

module.exports = makaToRabbit;