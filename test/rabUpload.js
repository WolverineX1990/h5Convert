var querystring= require('querystring');
var config = require('./../core/config').rabbit;
var RabbitUser = require('./../core/user/rabbitUser');
var rabSevice = require('./../core/rabbit/service');
var upload = require('./../core/rabbit/upload');
var utils = require('./../core/utils');
var needle = require('needle');

var user = new RabbitUser(config.userName, config.userPwd);

function loginSuccess() {
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
			console.log(user.info);
			console.log(res.cookie);
			var data = {
				serverType: 'A',
				type: 'IMAGE',
				count: 1,
				files: JSON.stringify([{"name":"upload.png"}]),
				appid: '63b96dc2-e6f2-4a5f-aaa8-3121b00485a4', //场景相关信息
				userfolder: -1,
				isAjax: true
			};
			rabSevice.getUploadToken(data).then(res=>{
				var token = JSON.parse(res)[0];
				// console.log('http://tenc1.rabbitpre.com/' + token.key);
				// console.log(token)
				var data = {
					'OSSAccessKeyId': token.accessKey,
					'policy': token.policy,
					'signature': token.token,
					'key': token.key,
					'x-oss-meta-ext': token.xparams.ext,
					'x-oss-meta-userid': token.xparams.userid,
					'x-oss-meta-appid': token.xparams.appid,
					'x-oss-meta-userfolder': token.xparams.userfolder,
					'x-oss-meta-type': token.xparams.type,
					'x-oss-meta-serverType': token.xparams.serverType,
					'x-oss-meta-bucket': token.xparams.bucket
				};
				return;
				utils.getResource('http://ali3.rabbitpre.com/24f8ff6e-cc9e-45ce-97c1-8cfc4356affe.png').then(res=> {
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: 'a.gif',
					    content_type: 'image/png'
					};

					var options = {
						headers: {
							'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
						},
						multipart: true
					}
					var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
				    needle.post(url, data, options, function(err, resp, body) {
					  console.log(body.toString());
					  console.log(resp.statusCode)
					});
				});
			});
		});
	});
}

function test() {
	user.login().then(loginSuccess);
}

module.exports = test;