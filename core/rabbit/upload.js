'use strict';
/**
 * 上传文件
 * @param files     经过formidable处理过的文件
 * @param req        httpRequest对象
 * @param postData    额外提交的数据
 */
var http = require('http');
var URL = require('url');
var header = require('./../request/header');
function upload(file, postData, url) {
	debugger;
	var param = URL.parse(url);
	var headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': header.UserAgent
	};
	var options = {
		host: param.host,
		path: param.path,
		method: 'POST',
		headers: headers
	};
	var req = http.request(options, function (response) {
	    response.setEncoding('utf-8');
	    console.log(response.statusCode);
	    response.on('end', function (res) {
	        console.log('end');
	    });
	});
	req.on('error', function(err) {
		console.log(err);
    });

    var boundaryKey = Math.random().toString(16);
    var endData = '\r\n----' + boundaryKey + '--';
    var filesLength = 0, content;

    // 初始数据，把post过来的数据都携带上去
    content = (function (obj) {
        var rslt = [];
        Object.keys(obj).forEach(function (key) {
            var arr = ['\r\n----' + boundaryKey + '\r\n'];
            arr.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n');
            arr.push(obj[key]);
            rslt.push(arr.join(''));
        });
        return rslt.join('');
    })(postData);

    // 组装数据
    content += '\r\n----' + boundaryKey + '\r\n' +
            'Content-Type: image/gif\r\n' +
            'Content-Disposition: form-data; name="file"; ' +
            'filename="' + file.name + '"; \r\n' +
            'Content-Transfer-Encoding: binary\r\n\r\n';
     file.contentBinary = new Buffer(content, 'utf-8');
     filesLength += file.contentBinary.length + file.binary.size;

    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', filesLength + Buffer.byteLength(endData));

    // 执行上传
    req.write(file.contentBinary);
    req.write(file.binary);
    req.end(endData);
}

module.exports = upload;