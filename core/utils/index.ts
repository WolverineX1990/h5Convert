import { get as httpGet } from 'http';
import { parse as urlParse } from 'url';
import { load as LoadHtml } from 'cheerio';
import * as zlib from 'zlib';

export function getHtml(targetUrl: string) {
	let promise: Promise<Object> = new Promise((resolve, reject) => {
		let param = urlParse(targetUrl);
		let options = {
			host: param.host,
			path: param.path,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
			}
		};
        var req = httpGet(options, function (response) {
            let isGzip = false;
            if (response.headers['content-encoding']) {
                isGzip = response.headers['content-encoding'].indexOf('gzip') != -1;
            }
            
		    response.setEncoding('utf-8');  //二进制binary
            let data: string = '';
            // console.log(response.statusCode);
		    response.on('data', function (res) {    //加载到内存
                data += res;
            }).on('end', function () {
                if (isGzip) {
                    data = zlib.unzipSync(data).toString();
                }
                
                resolve({
                    data: data,
                    cookie: response.headers['set-cookie']
                });
        });
		});
		req.on('error', function(err) {
            reject(err);
        });
	});
	return promise;
}

export function getPageData(html: string, dataReg: RegExp) {
	let promise = new Promise((resolve, reject) => {
		let $ = LoadHtml(html);
		let context;
		$('script').each(function(index, script) {
			context = $(script).html();
			if(dataReg.test(context)) {
                let res = context.match(dataReg)[1];
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

export function getResource(url): Promise<string> {
    let param = urlParse(url);
    let promise: Promise<string> = new Promise((resolve, reject) => {
        let options = {
            host: param.host,
            path: param.path,
            headers: {
                'Host': param.host,
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
            }
        };
        let req = httpGet(options, function (response) {
            response.setEncoding('binary');
            let data = '';
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

let rotateReg = /rotateZ\((-?\d*\.?\d*)deg\)/;
let scaleReg = /scale\((-?\d+),\s?(\d+)\)/;
let translate3dReg = /translate3d\((-?\d*(?:px)?),\s?(-?\d*(?:px)?),\s?(-?\d*(?:px)?)\)/;

export function parseTransform(str) {
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

function toInt(int) {
    return toFixed(int, 0);
}

function toFixed(int, n) {
    if (typeof int !== 'number') {
        int = parseFloat(int);
    }
    return parseFloat(int.toFixed(n))
}