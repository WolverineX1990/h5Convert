var config = require('./../config');
var Scene = require('./../scene');
// var logger = require('./../logger');
var rabConfig = config.rabbit;
var Rabbit = require('./../rabbit');
var RabbitUser = require('./../user/rabbitUser');
var rabbitSevice = require('./../rabbit/service');
var RABPAGE = require('./../const/RABPAGE');

function eqxToRabbit(url) {
	var user = new RabbitUser(rabConfig.userName, rabConfig.userPwd);
	var scene = new Scene(url);
	return scene.loadData().then(()=>user.login())
				.then(res=>{
					rabbitSevice.setHeaders({
						Origin: rabConfig.origin, 
						Cookie: user.cookie[0],
						'Content-Type': 'application/json'
					});
					return user.getSession();
				})
				// .then(res=>rabbitSevice.getUserInfo({'x-jwt-token': user.info.token}))
				.then((res)=>{
					rabbitSevice.setHeaders({
						Origin: rabConfig.origin, 
						Cookie: user.cookie.join('; '),
						'Content-Type': 'application/json'
					});
					return rabbitSevice.createTemplate(RABPAGE);
				})
				.then(res=>{
					var rabbit = new Rabbit(res.data);
					return scene.toRabbit(rabbit);
				})
				// .then(res=>logger.insert(scene.data.id, 1, url))
				// .then(res=>logger.close());
}

module.exports = eqxToRabbit;