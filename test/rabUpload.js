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
			// console.log(user.info);
			// console.log(res.cookie);
			var data = {
				serverType: 'A',
				type: 'IMAGE',
				count: 1,
				files: JSON.stringify([{"name":"upload.svg"}]),
				appid: '1d149230-e81b-43da-8f29-02b2f491a240', //场景相关信息
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
				utils.getResource('http://res1.eqh5.com/3e06ffaa-992c-4830-ab3d-b07f95fe557c.svg').then(res=> {
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: 'a.svg',
					    content_type: 'image/svg+xml'
					};

					var options = {
						multipart: true
					}
					var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
				    needle.post(url, data, options, function(err, resp, body) {
				    	console.log(url + '/' + data.key);
				    	// console.log(body.toString());
					  	// console.log(resp.statusCode);
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