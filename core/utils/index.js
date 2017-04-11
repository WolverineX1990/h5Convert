var extend = require('./extend');
module.exports = {
	getHtml: getHtml,
	getPageData: getPageData,
	extend: extend,
	each: each,
	getBase64: getBase64
};

var http = require('http');
var URL = require('url');
var cheerio = require('cheerio');
function getHtml(targetUrl) {
	var promise = new Promise(function func(resolve, reject){
		var param = URL.parse(targetUrl);
		var options = {
			host: param.host,
			path: param.path,
			headers: {
				'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
			}
		};
	    var req = http.get(options, function (response) {
		    response.setEncoding('utf-8');  //二进制binary
	    	var data = '';
		    response.on('data', function (res) {    //加载到内存
		        data += res;
		    }).on('end', function () {
		        resolve(data);
		    });
		});
		req.on('error', function(err) {
	    	reject(err);
	    });
	});
	return promise;
}

function getPageData(html, dataReg) {
	var promise = new Promise(function(resolve, reject) {
		var $ = cheerio.load(html);
		var context;
		$('script').each(function(index, script) {
			context = $(script).html();
			if(dataReg.test(context)) {
				var res = '{' + context.match(dataReg)[1];
				resolve(res);
				return false;
			}
		});
		if(!context) {
			reject('not found');	
		}
	});

	return promise;
}

/**
 * [getBase64 获取文件的base64数据]
 * @param  {[type]} url [description]
 * @return {[type]}        [description]
 */
function getBase64(url) {
    var param = URL.parse(url);
    var promise = new Promise(function func(resolve, reject){
        var options = {
            host: param.host,
            path: param.path,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
            }
        };
        var req = http.get(options, function (response) {
            response.setEncoding('binary');
            var data = '';
            response.on('data', function (res) {    //加载到内存
                data += res;
            }).on('end', function () {
                var base64 = new Buffer(data, 'binary').toString('base64');
                resolve(base64);
            });
        });
        req.on('error', function(err) {
            reject(err);
        });
    });
    return promise;
}

function each(object, iterFunction) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var ret = iterFunction.call(this, key, object[key]);
            // if (ret === ALY.util.abort)
            //     break;
        }
    }
}