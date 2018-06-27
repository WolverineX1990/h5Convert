import { get as htppGet } from 'http';
import { parse as urlParse } from 'url';
import { stringify } from 'querystring';

export function get(params: any, config?: any): Promise<any> {
  let param = urlParse(params.url);
		let promise: Promise<any> = new Promise(function(resolve, reject){
			if(params.data) {
				param.path = param.path + (/\?/.test(param.path) ? '&' : '?') + stringify(params.data);
			}
			let options = {
				host: param.host,
				path: param.path,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
					'Upgrade-Insecure-Requests': 1,
					Host: 's1.eqxiu.com',
					Pragma: 'no-cache',
					Connection: 'keep-alive',
					'Cache-Control': 'no-cache',
					'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
					'Accept-Encoding': 'gzip, deflate',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
				}
			};
			if(params.headers) {
				for(let key in params.headers) {
					options.headers[key] = params.headers[key];
				}
			}
		    let req = htppGet(options, function (response) {
				response.setEncoding('utf8');
			    let data = '';
			    console.log(response.statusCode);
			    response.on('data', function (res) {
					console.log(res.toString());
					console.log('&&&&&&&&&&&&&&&&&&&&&&&')
			        data += res;
			    }).on('end', function () {
			    	if(config) {
			    		if(config.getCookie) {
			    			resolve({
			    				data,
			    				cookie: response.headers['set-cookie']
			    			});
			    		}
			    	} else {
			    		resolve({data});
			    	}			        
			    });
			});
			req.on('error', function(err) {
		    	reject(err);
		    });
    });
    
    return promise;
}