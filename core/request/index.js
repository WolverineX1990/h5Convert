module.exports = {
	get: get,
	post: post,
	put: put
};

var http = require('http');
var URL = require('url');
var header = require('./header');

/**
 * [get promise封装get接口]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function get(params) {
	try {
		var param = URL.parse(params.url);
		var promise = new Promise(function func(resolve, reject){
			var options = {
				host: param.host,
				path: param.path,
				headers: {
					'User-Agent': header.UserAgent
				}
			};
			if(params.headers) {
				for(var key in params.headers) {
					options.headers[key] = params.headers[key];
				}
			}
		    var req = http.get(options, function (response) {
			    response.setEncoding('utf-8');
			    var data = '';
			    // console.log(response.statusCode);
			    response.on('data', function (res) {
			        data += res;
			    }).on('end', function () {
			        resolve(data);
			    });
			});
			req.on('error', function(err) {
		    	reject(err);
		    });
		});
	} catch(err) {
		console.error(err);
	}
	return promise;
}

/**
 * [post promise封装post接口]
 * @param  {[type]} params [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function post(params, config) {
	try {
		var param = URL.parse(params.url);
		var headers = {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': header.UserAgent
				};
		if(params.headers) {
			for(var key in params.headers) {
				headers[key] = params.headers[key];
			}
		}

		var promise = new Promise(function func(resolve, reject){
			var options = {
				host: param.host,
				path: param.path,
				method: 'POST',
				headers: headers
			};
		    var req = http.request(options, function (response) {
			    response.setEncoding('utf-8');
			    var data = '';
			    // console.log(response.statusCode);
			    response.on('data', function (res) {    //加载到内存
			        data += res;
			    }).on('end', function () {
			    	if(config) {
			    		if(config.getCookie) {
			    			resolve({
			    				data: data,
			    				cookie: response.headers['set-cookie']
			    			});
			    		}
			    	} else {
			    		resolve(data);
			    	}
			    });
			});
			req.on('error', function(err) {
				console.log(err);
		    	reject(err);
		    });
		    req.write(params.data);
			req.end();
		});
	} catch(err) {
		console.error(err);
	}
	return promise;
}

/**
 * [post promise封装post接口]
 * @param  {[type]} params [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function put(params, config) {
	try {
		var param = URL.parse(params.url);
		var headers = {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': header.UserAgent
				};
		if(params.headers) {
			for(var key in params.headers) {
				headers[key] = params.headers[key];
			}
		}

		var promise = new Promise(function func(resolve, reject){
			var options = {
				host: param.host,
				path: param.path,
				method: 'PUT',
				headers: headers
			};
			console.log(1);
		    var req = http.request(options, function (response) {
			    response.setEncoding('utf-8');
			    var data = '';
			    console.log(response.statusCode);
			    response.on('data', function (res) {    //加载到内存
			        data += res;
			    }).on('end', function () {
			    	if(config) {
			    		if(config.getCookie) {
			    			resolve({
			    				data: data,
			    				cookie: response.headers['set-cookie']
			    			});
			    		}
			    	} else {
			    		resolve(data);
			    	}
			    });
			});
			req.on('error', function(err) {
				console.log(err);
		    	reject(err);
		    });
		    req.write(params.data);
			req.end();
		});
	} catch(err) {
		console.error(err);
	}
	return promise;
}