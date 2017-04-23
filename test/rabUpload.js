var querystring= require('querystring');
var config = require('./../core/config').rabbit;
var RabbitUser = require('./../core/user/rabbitUser');
var rabSevice = require('./../core/rabbit/service');
var upload = require('./../core/rabbit/upload');
var utils = require('./../core/utils');

var user = new RabbitUser(config.userName, config.userPwd);

function loginSuccess() {
	rabSevice.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});
	user.getSession().then(res=>{
		rabSevice.test2({'x-jwt-token': user.info.token}).then(res=>{
			rabSevice.setHeaders({
				Origin: config.origin, 
				cookie: res.cookie
			});
			var data = {
				serverType: 'A',
				type: 'IMAGE',
				count: 1,
				files: JSON.stringify([{"name": "a.gif"}]),
				appid: '63b96dc2-e6f2-4a5f-aaa8-3121b00485a4', //场景相关信息
				userfolder: -1,
				isAjax: true
			};
			rabSevice.getUploadToken(data).then(res=>{
				var token = JSON.parse(res)[0];
				// console.log(token);
				var data = {
					'OSSAccessKeyId': token.accessKey,
					'policy': token.policy,
					'signature': token.token,
					'key': utils.randomStr()+'.gif',
					'x-oss-meta-ext': '.gif',
					'x-oss-meta-userid': '19d9e8bf-60f0-41f7-8865-9c6846c8da27',
					'x-oss-meta-appid': '63b96dc2-e6f2-4a5f-aaa8-3121b00485a4',
					'x-oss-meta-userfolder': -1,
					'x-oss-meta-type': 'IMAGE',
					'x-oss-meta-serverType': 'A',
					'x-oss-meta-bucket': 'rabbitpre'
				};
				var header = {
					'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryp7HM9uwWRU6DFVSx',
					Origin: 'http://www.rabbitpre.com',
					'Content-Length': 266566
				};
				utils.getResource('http://res1.eqh5.com/FqPjxlaR2sHeAlSidoNkcOpP2Vyv').then(res=> {
					var binary = new Buffer(res, 'utf8');
					var file = {
						name: 'aa.gif',
						binary: binary
					};
					upload(file, data, 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com/');
				});
			});
		});
	});
}

function test() {
	user.login().then(loginSuccess);
}

module.exports = test;