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
			// console.log(res);
			// var tt = {
			// 	isAjax: true
			// };
			// rabSevice.getCmpId(tt).then(res=>console.log(res));
			// return;
			var data = {
				serverType: 'A',
				type: 'IMAGE',
				count: 1,
				files: JSON.stringify([{"name":"a.jpg"}]),
				appid: '820819b3-9390-4bdc-a62d-1fe67e3411ef', //场景相关信息
				userfolder: -1,
				isAjax: true
			};

			var data1 = {
				count: 1,
				type: 'IMAGE',
				needCallback: true,
				isUserFile: true,
				userfolder: -1
			};
			rabSevice.getUploadToken(data).then(res=>{
				console.log(JSON.parse(res))
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
				// var url = 'http://res1.eqh5.com/3e06ffaa-992c-4830-ab3d-b07f95fe557c.svg';
				var url = 'http://wscdn.rabbitpre.com/fdf5a06d-e600-4195-a580-4ec3899251fa-7285';
				utils.getResource(url).then(res=> {
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: 'a.jpg',
					    // content_type: 'application/svg'
					    // content_type: 'application/octet-stream'
					    content_type: 'image/jpeg'
					    // content_type: 'image/svg+xml'
					};

					var options = {
						multipart: true
					}
					var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
					console.log(data)
				    needle.post(url, data, options, function(err, resp, body) {
				    	console.log(url + '/' + data.key);
				    	console.log('#####################################');
				    	console.log(body.toString());
					  	// console.log(resp);
					  	// console.log(err)
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