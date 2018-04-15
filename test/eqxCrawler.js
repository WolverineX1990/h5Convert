var fs = require('fs');
var cheerio = require('cheerio');
var utils = require('./../core/utils');
//http://www.eqxiu.com/site/show/visitor/ff8080815925c1fe01595ea80e6b09bb
// var userIds = [
// 		'ff80808154eb2a0e015505b731182eda',
// 		'8a8080f0589b354d0158a9baa9ea002d',
// 		'ff80808154e83b400154fff013003e66',
// 		'4a2d8af948b198210148fcae52bc0083',
// 		'4a2d8aae4a389b92014a570fcc5021bd',
// 		'4a2d8aae4e43a5d1014e4ec74ace4a68'
// 	];
//4a2d8af9543a92cc0154614c785d4d88  4a2d8af94dbdbe58014dd190cd201498
var userIds = ['4a2d8aae4e53405b014e62187aa34d69'];

function test() {
	var page = {
		pageNo: 1, 
		pageSize: 19
	};

	copyPage(page);
}

function copyPage(page) {
	var url = getTargetUrl(page.pageNo, page.pageSize);
	page.pageNo++;
	return utils.getHtml(url)
				.then(res=>parse(res))
				.then(res=>{
					if(res) {
						return copyPage(page);	
					}

					return;
				});
}

function parse(res) {
	var $ = cheerio.load(res);
	var promise = new Promise(function(resolve, reject){
		var goodsList = $('.template');
		if(goodsList.length > 1) {
			var str = '';
			goodsList.each(function(index, goods) {
				if(index == 0) {
					return;
				}
				var $goods = $(goods);
				var url = 'http://store.eqxiu.com' + $goods.find('.light').attr('href');
				var fun = $goods.find('.light').attr('onclick');
				var reg = /event,"([\s|\w|\W]+)"/;
				var uid = fun.match(reg)[1];
				var numReg = /scene-([\d]+).html/;
				var num = parseInt(url.match(numReg)[1]);
				// if(num <= 413990) {
				// 	resolve();
				// }
				if(userIds.indexOf(uid) > -1) {
					console.log(url);
					str += url + '\r\n';
				}	
			});
			if(str) {
				resolve(true);
				// fs.writeFile('./sceneList.json', str, { 'flag': 'a' }, function(err) {
				// 	resolve();
				// });
			} else {
				resolve(true);
			}
		} else {
			reject(Error('end'));
		}
	});

	return promise;
}

function getTargetUrl(pageNo, pageSize) {
	return `http://store.eqxiu.com/cats-2.html?module=main&keywords=&subcat=&priceRange=&brandId=&type=&sortBy=create_time|Desc&pageNo=${pageNo}&pageSize=${pageSize}`;
}

module.exports = test;