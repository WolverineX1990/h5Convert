'use strict';
var extend = require('./extend');
var crypto = require('./crypto');
// var convertpath = require('./convertpath');
module.exports = {
	getHtml: getHtml,
	getPageData: getPageData,
	extend: extend,
	each: each,
	getResource: getResource,
	crypto: crypto,
	randomStr: randomStr,
	toInt: toInt,
	parseTransform: parseTransform,
    // convertpath: convertpath
};

var http = require('http');
var URL = require('url');
var cheerio = require('cheerio');

function getHtml(targetUrl) {
	var promise = new Promise(function(resolve, reject){
		var param = URL.parse(targetUrl);
		var options = {
			host: param.host,
			path: param.path,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
			}
		};
	    var req = http.get(options, function (response) {
		    response.setEncoding('utf-8');  //二进制binary
            var data = '';
            // console.log(response.statusCode);
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
                var res = context.match(dataReg)[1];
                if(res.indexOf(';')>-1) {
                    res = '{' + res.split(';')[0];
                } else {
                    res = '{' + res;
                }
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
function getResource(url) {
    var param = URL.parse(url);
    var promise = new Promise(function(resolve, reject){
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
                resolve(data);
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

/**
 * [randomStr 随机串]
 * @param  {[type]} len [description]
 * @return {[type]}     [description]
 */
function randomStr(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function toFixed(int, n) {
    if (typeof int !== 'number') {
        int = parseFloat(int);
    }
    return parseFloat(int.toFixed(n))
}

function toInt(int) {
    return toFixed(int, 0);
}

var rotateReg = /rotateZ\((-?\d*\.?\d*)deg\)/;
var scaleReg = /scale\((-?\d+),\s?(\d+)\)/;
var translate3dReg = /translate3d\((-?\d*(?:px)?),\s?(-?\d*(?:px)?),\s?(-?\d*(?:px)?)\)/;

function parseTransform(str) {
    str += '';

    var obj = {
        rotate: 0,
        scale: {
            x: 1,
            y: 1
        },
        translate3d: {
            x: 0,
            y: 0,
            z: 0
        }
    };
    str = str.replace(rotateReg, (match, $1) => obj.rotate = toInt($1));
    str = str.replace(scaleReg, (match, $1, $2) => obj.scale = {
        x: toInt($1),
        y: toInt($2)
    });
    str.replace(translate3dReg, (match, $1, $2, $3) => obj.translate3d = {
        x: toInt($1),
        y: toInt($2),
        z: toInt($3)
    });

    return obj;
}