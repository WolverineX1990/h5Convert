module.exports = {
    upload: upload,
    getBase64: getBase64,
    getSvg: getSvg
};

var request = require('./../request');
var URL = require('url');
var http = require('http');

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

/**
 * [getSvg 获取svg]
 * @param  {[type]} url [description]
 * @return {[type]}        [description]
 */
function getSvg(url) {
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


/**
 * [upload 上传base64数据]
 * @param  {[type]} data  [description]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
function upload(data, token) {
    return request.post({
        url: 'http://up.qiniu.com/putb64/-1',
        data: data,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': 'UpToken ' + token
        }
    });
}