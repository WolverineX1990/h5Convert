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
				console.log(token);
				// var newName = utils.randomStr() + '.gif';
				console.log('http://tenc1.rabbitpre.com/' + token.key);
				var data = {
					'OSSAccessKeyId': token.accessKey,
					'policy': token.policy,
					'Signature': token.token,
					'key': token.key
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
				needle.get('http://res1.eqh5.com/FqPjxlaR2sHeAlSidoNkcOpP2Vyv', function(err, resp) {
					console.log(data);
					data.file = {
						buffer: resp.body,
					    filename: 'a.gif',//User-Agent
					    content_type : 'image/gif'
					};

					var options = {
						headers: {
							Origin: 'http://www.rabbitpre.com',
							'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
						},
						multipart: true
					}
				    needle.post('http://rabbitpre.oss-cn-shenzhen.aliyuncs.com/', data, options, function(err, resp, body) {
					  console.log(resp.statusCode);
					  console.log('err:'+err);
					  // console.log(resp)
					  // if you see, when using buffers we need to pass the filename for the multipart body. 
					  // you can also pass a filename when using the file path method, in case you want to override 
					  // the default filename to be received on the other end. 
					});
				});
				// utils.getResource('http://res1.eqh5.com/FqPjxlaR2sHeAlSidoNkcOpP2Vyv').then(res=> {
				// 	var binary = new Buffer(res, 'binary');
				// 	var file = {
				// 		name: 'aa.gif',
				// 		binary: binary
				// 	};
				// 	data.file = {
				// 		buffer: binary,
				// 	    filename: 'tt.gif',
				// 	    content_type : 'image/gif'
				// 	};
				// 	needle.post('http://rabbitpre.oss-cn-shenzhen.aliyuncs.com/', data, { multipart: true }, function(err, resp, body) {
				// 	  console.log(resp.body);
				// 	  console.log('err:'+err);
				// 	  // console.log(resp)
				// 	  // if you see, when using buffers we need to pass the filename for the multipart body. 
				// 	  // you can also pass a filename when using the file path method, in case you want to override 
				// 	  // the default filename to be received on the other end. 
				// 	});
				// 	// upload(file, data, 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com/');
				// });
			});
		});
	});
}

function test() {
	user.login().then(loginSuccess);
}

module.exports = test;