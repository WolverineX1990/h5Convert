var config = require('./../config');

var eqxConfig = config.eqx;
var Scene = require('./../scene');
var sceneService = require('./../scene/services');
var EqxUser = require('./../user/eqxUser');

var rabConfig = config.rabbit;
var Rabbit = require('./../rabbit');
var RabbitUser = require('./../user/rabbitUser');
var rabbitSevice = require('./../rabbit/service');

var makaConfig = config.maka;
var Maka = require('./../maka');
var makaService = require('./../maka/service');
var MakaUser = require('./../user/makaUser');

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

function eqxToRabbit(url) {
	var user = new RabbitUser(rabConfig.userName, rabConfig.userPwd);
	var scene = new Scene(url);
	var json = '{"name":"未命名","tags":"","userid":null,"desc":null,"imgurl":null,"shorturl":null,"imgPath":null,"state":null,"statetime":null,"showviewcount":true,"music_is_auto":1,"timeinterval":0,"comment":0,"logo":null,"logoPath":null,"level":null,"music":null,"musicname":null,"device":"iPhone 5","width":320,"height":504,"in":null,"out":null,"loop":null,"company":null,"link":null,"publish":0,"switch_guide":true,"gather":null,"app_url":null,"templateid":null,"pages":[{"id":null,"row":0,"col":0,"in":null,"out":null,"bgcol":null,"bgimage":null,"bgserver":null,"bgleft":0,"bgtop":0,"cmps":"[]"}]}';
	return scene.loadData().then(res=>user.login().then(loginSuccess));

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
					var rabbit = new Rabbit(json);
					return scene.toRabbit(rabbit);
				});
			});
		});
	}
}

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
				json.propertys = oriScene.data.propertys;
				var scene = new Scene(json);
				scene.user = eqxUser;
			 	return scene.copy(oriScene.pages);
			});
		});
	}
}

module.exports = {
	rabToEqx: rabToEqx,
	eqxToMaka: eqxToMaka,
	eqxToRabbit: eqxToRabbit,
	copyEqx: copyEqx
}