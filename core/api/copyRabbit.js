var config = require('./../config');
var rabConfig = config.rabbit;
var Rabbit = require('./../rabbit');
var RabbitUser = require('./../user/rabbitUser');
var rabbitSevice = require('./../rabbit/service');

function copyRabbit(url) {
	var user = new RabbitUser(rabConfig.userName, rabConfig.userPwd);
	var oriRabbit = new Rabbit(url);
	var json = '{"name":"未命名","tags":"","userid":null,"desc":null,"imgurl":null,"shorturl":null,"imgPath":null,"state":null,"statetime":null,"showviewcount":true,"music_is_auto":1,"timeinterval":0,"comment":0,"logo":null,"logoPath":null,"level":null,"music":null,"musicname":null,"device":"iPhone 5","width":320,"height":504,"in":null,"out":null,"loop":null,"company":null,"link":null,"publish":0,"switch_guide":true,"gather":null,"app_url":null,"templateid":null,"pages":[{"id":null,"row":0,"col":0,"in":null,"out":null,"bgcol":null,"bgimage":null,"bgserver":null,"bgleft":0,"bgtop":0,"cmps":"[]"}]}';
	return oriRabbit.loadData().then(res=>user.login().then(loginSuccess));

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
				return rabbitSevice.createTemplate(data).then(res=>{
					var json = JSON.parse(res);
					var oriData = oriRabbit.data;//data.pages
					json.name = oriData.name;
					json.desc = oriData.description;
					json.publish = true;
					json.in = oriData.in;
					json.imgurl = oriData.imgurl;
					json.music = origin.music;
					var rabbit = new Rabbit(json);
					// return scene.toRabbit(rabbit);
				});
			});
		});
	}
}

module.exports = copyRabbit;