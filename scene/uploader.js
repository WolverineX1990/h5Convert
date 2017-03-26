module.exports = {
    upload: upload,
    getBase64: getBase64
};

var request = require('./../request');
var URL = require('url');
var http = require('http');
var config = require('./../config');

function getBase64(imgUrl) {
    var param = URL.parse(imgUrl);
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