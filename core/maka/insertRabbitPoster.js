'use strict';
var utils = require('./../utils');
var fileHost = 'http://res2.maka.im/shapeSVG/';
var imgHost = 'http://img2.maka.im/';
var compTypes = {
	'img': 'image',
	'shape': 'shape',
	'text': 'text',
	'map': 'map'
};

function insertRabbitPoster(rabbit, contents) {
	var rabPages = rabbit.data.pages;
	var page = perfectPageJson(rabPages[0], contents[0]);
	if(rabbit.data.gather) {
		rabbit.data.gather = JSON.stringify(rabbit.data.gather);
	}

	return uploadRes(rabbit, rabPages).then(res=>rabbit.save());
}

function perfectPageJson(pageJson, elements) {
	pageJson.cmps = [];
	for(var i = 0;i<elements.length;i++) {
		if(elements[i].type == 'new-form') {
			var cmps = getFormCmps(elements[i]);
		} else {
			var cmp = perfectCompJson(elements[i]);
			if(cmp) {
				try {
					if(cmp.cmpType == 'ginput') {
						if(!rabbitData.gather) {
							rabbitData.gather = {id: 0, strict: {}};
						}
						rabbitData.gather.strict[cmp.id] = cmp.text;
					}
				}catch(e) {
					console.log(e);
				}
				pageJson.cmps.push(cmp);
			}
		}
	}

	return pageJson;
}

function perfectCompJson(compJson) {
	var newJson = {
		id: randomId(),
		style: getStyle(compJson.style, compJson.type),
		cmpType: compTypes[compJson.type]
	};

	if(compJson.type == 'text') {
		newJson.text = compJson.content;
		newJson.style.height = 'auto';
		newJson.style['font-family'] = '黑体';
		newJson.style.color = compJson.style.color;
	} else if(compJson.type == 'img') {
		var url = compJson.picId;
		var reg = /^http/;
		if(!reg.test(url)) {
			url = imgHost + url;
		}
		newJson.src = url;
	} else if(compJson.type == 'shape') {
		newJson.fills = compJson.colorScheme || [];
		// if(compJson.colorScheme) {;
		// 	for (var key in compJson.colorScheme) {
		// 		newJson.fills.push(compJson.colorScheme[key]);
		// 	}
		// }
		newJson.src = perfectSvg(compJson.svgDom);
		newJson.shapeType = 'custom';
	} else {
		console.log(compJson.type + ' not found');
		return null;
	}

	return newJson;
}

function getStyle(json, type) {
	var style = {
		height: json.height/2,
		width: json.width/2,
		top: json.top/2,
		left: json.left/2
	};

	if(json.textAlign) {
		style['text-align'] = json.textAlign;
	}

	if(json.borderradius) {
		style['border-radius'] = json.borderradius;
	}

	if(json.rotate) {
		style.transform = getRotateStr(json.rotate);
	}

	if(json['font-weight']) {
		style['font-weight'] = json['font-weight'];
	}

	if(json.fontSize) {
		style['font-size'] = json.fontSize;
	}

	if(json['line-height']) {
		style['line-height'] = json['line-height'];
	}

	return style;
}

function getRotateStr(rotate) {
    if (rotate !== undefined) {
        return `rotate(${rotate}deg)`
    }
    return '';
}

function randomId() {
    return Math.ceil(Math.random() * 10000000000);
}

function uploadRes(rabbit, pages) {
	var list = [];
	var imgList = [];
	var urls = [];
	var svgComs = [];
	for(var i = 0;i<pages.length;i++) {
		var cmps = pages[i].cmps;
		for(var j = 0;j<cmps.length;j++) {
			var cmp = cmps[j];
			if(cmp.cmpType === 'image') {
				if(urls.indexOf(cmp.src) === -1) {
					urls.push(cmp.src);
					imgList.push({
						url: cmp.src,
						type: 'image'
					});
				}
				list.push(cmp);
			} else if(cmp.cmpType === 'shape') {
				svgComs.push(cmp);
			}
		}
	}
	if(list.length) {
		return uploadImgs(rabbit, imgList, list).then(()=>uploadSvgs(rabbit, svgComs));
	} else {
		var promise = new Promise(function(resolve, reject){
			resolve();
		});
		return promise;
	}
}

function uploadImgs(rabbit, imgList, cmps) {
	var obj = imgList.shift();
	if(!obj) {
		var promise = new Promise(function(resolve, reject){
			resolve();
		});
		return promise;
	}
	return rabbit.uploadRes(obj).then(res => {
		var url = 'http://tenc1.rabbitpre.com/' + res.key;
		for(var i = 0;i < cmps.length;i++) {
			if(cmps[i].src == obj.url) {
				cmps[i].src = url;
			}
		}
		return uploadImgs(rabbit, imgList, cmps);
    });
}

function uploadSvgs(rabbit, cmps) {
	var obj = cmps.shift();
	if(!obj) {
		var promise = new Promise(function(resolve, reject){
			resolve();
		});
		return promise;
	}
	return rabbit.uploadSvg(obj.src).then(res => {
		var url = 'http://tenc1.rabbitpre.com/' + res.key;
		obj.src = url;
		return uploadSvgs(rabbit, cmps);
    });
}

function getFormCmps(obj) {

}

var svgBase = ['line', 'rect', 'circle', 'ellipse', 'polygon', 'polyline'];
function perfectSvg(str) {
	var hasBase = false;
	svgBase.forEach(type=>{
		if(str.indexOf(type) > -1) {
			hasBase = true;
		}
	});

	if(!hasBase) {
		return str;
	}

	return utils.convertpath(str);
}

module.exports = insertRabbitPoster;