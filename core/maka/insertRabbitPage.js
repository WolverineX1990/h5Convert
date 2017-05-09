'use strict';
var aniType = require('./aniType');
var utils = require('./../utils');
var fileHost = '';
var compTypes = {
	'pic': 'image',
	'pshape': 'shape',
	'ptext': 'text',
	'map': 'map'
};

function insertRabbitPage(rabbit, pages) {
	var rabPages = rabbit.data.pages;
	rabPages[0].deleted = true;
	for(var i = 0;i<pages.length;i++) {
		try{
			var page = perfectPageJson(pages[i], i, rabbit.data);
			rabPages.push(page);
		} catch(e) {
			console.log(e);
		}
	}

	if(rabbit.data.gather) {
		rabbit.data.gather = JSON.stringify(rabbit.data.gather);
	}

	return uploadRes(rabbit, rabPages).then(res=>rabbit.save());
}

function perfectPageJson(pageJson, pageNum, rabbitData) {
	var json = {
		appid: rabbitData.id,
		row: pageNum,
		col: 0,
		in: null,
		out: null,
		bgcol: null,
		bgimage: null,
		bgserver: null,
		bgleft: 0,
		bgtop: 0,
		cmps: []
	};
	var elements = pageJson.elements.sort((a, b)=>{
		var aIndex = a.css.zIndex;
		var bIndex = b.css.zIndex;
		return aIndex - bIndex;
	});
	for(var i = 0;i<elements.length;i++) {
		if(elements[i].type == 'newForm') {
			var cmps = getFormCmps(elements[i]);
		} else {
			var cmp = perfectCompJson(elements[i]);
			if(cmp) {
				if(elements[i].type == 3) {
					json.cmps.splice(0, 0, cmp);
				} else {
					try {
						if(cmp.cmpType == 'ginput') {
							if(!rabbitData.gather) {
								rabbitData.gather = {id: 0, strict: {}};
							}
							rabbitData.gather.strict[cmp.tid] = cmp.text;
						}
					}catch(e) {
						console.log(e);
					}
					json.cmps.push(cmp);
				}
			}
		}
	}

	return json;
}

function perfectCompJson(compJson) {
	var newJson = {
		tid: randomId(),
		style: getStyle(compJson.css, compJson.type),
		trigger: [],
		animation: [],
		cmpType: compTypes[compJson.type]
	};

	if(compJson.properties && compJson.properties.anim) {
		var anims = compJson.properties.anim;
		for (var i = 0; i <anims.length; i++) {
			if(aniType[anims[i].type]) {
				var animObj = aniType[anims[i].type][anims[i].direction];
				if(animObj && animObj.rabbit) {
					var count = anims[i].count == 1 ? 'infinite' : anims[i].countNum;
					var anim = {
						name: animObj.rabbit,
						count: count,
						delay: anims[i].delay
					};
					newJson.animation.push(anim);
				} else {
					console.log('id:' + compJson.id + '-anim:'+aniType[anims[i].type].name+'direction-'+anims[i].direction+'not found!');	
				}
			} else {
				console.log('id:' + compJson.id + '-anim-type-direction'+anims[i].type+'-'+anims[i].direction+'not found!');
			}
		}
	}

	if(compJson.type == 'ptext') {
		newJson.text = compJson.con;
		newJson.style.height = 'auto';
		newJson.style['font-family'] = '黑体';
	} else if(compJson.type == 'pic') {
		var url = compJson.properties.src;
		var reg = /^http/;
		if(!reg.test(url)) {
			url = fileHost + url;
		}
		newJson.file = {
			url: url,
			key: url,
			server: 'Q'
		};
	} else if(compJson.type == 'pshape') {
		newJson.fill = [];
		var url = compJson.properties.src;
		if(url == 'group1/M00/B1/A3/yq0KXFZysi-ACYaKAAACDQH4Nes625.svg') {
			url = 'http://wscdn.rabbitpre.com/3fe3893e-11fb-474b-b501-c753e922a3a0-3161';
		}
		var reg = /^http/;
		if(!reg.test(url)) {
			url = fileHost + url;
		}
		if(compJson.properties && compJson.properties.items) {
			var items = compJson.properties.items;
			for (var i = 0; i < items.length; i++) {
				newJson.fill.push(items[i].fill);
			}
		}
		newJson.src = url;
	} else {
		console.log(compJson.type + ' not found');
		return null;
	}

	return newJson;
}

function getStyle(css, type) {
	var style = {
		height: css.height,
		width: css.width,
		top: css.top,
		left: css.left,
		rotate: css.rotate,
		transform: css.transform,
		opacity: css.opacity,
		color: css.color
	};

	if(css.lineHeight && type!=2) {
		style['line-height'] = css.lineHeight;
	}

	if(css.textAlign) {
		style['text-align'] = css.textAlign;
	}

	if(css.backgroundColor) {
		style['background-color'] = css.backgroundColor;
	}

	if(css.borderRadius) {
		style['border-radius'] = css.borderRadius;
	}

	if(css.transform) {
		var rotate = utils.parseTransform(css.transform).rotate;
		style.rotate = rotate;
		style.transform = getRotateStr(rotate);
	}

	if(css.borderStyle && css.borderWidth && css.borderColor) {
		style['border-style'] = css.borderStyle;
		style['border-color'] = css.borderColor;
		style['border-width'] = css.borderWidth;
	}

	if(css.fontSize) {
		style['font-size'] = css.fontSize;
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
	for(var i = 0;i<pages.length;i++) {
		var cmps = pages[i].cmps;
		for(var j = 0;j<cmps.length;j++) {
			var cmp = cmps[j];
			if(cmp.cmpType === 'image') {
				if(urls.indexOf(cmp.file.key) === -1) {
					urls.push(cmp.file.key);
					imgList.push({
						url: cmp.file.key,
						type: 'image'
					});
				}
				list.push(cmp);
			} else if(cmp.cmpType === 'shape' && cmp.src!='http://wscdn.rabbitpre.com/3fe3893e-11fb-474b-b501-c753e922a3a0-3161') {
				if(urls.indexOf(cmp.src) === -1) {
					urls.push(cmp.src);
					imgList.push({
						url: cmp.src,
						type: 'svg'
					});
				}
				list.push(cmp);
			}
		}
	}
	if(list.length) {
		return uploadImgs(rabbit, imgList, list);
	} else {
		var promise = new Promise(function func(resolve, reject){
			resolve();
		});
		return promise;
	}
}

function uploadImgs(rabbit, imgList, cmps) {
	var obj = imgList.shift();
	if(!obj) {
		var promise = new Promise(function func(resolve, reject){
			resolve();
		});
		return promise;
	}
	return rabbit.uploadRes(obj).then(res => {
		var url = 'http://tenc1.rabbitpre.com/' + res.key;
		for(var i = 0;i < cmps.length;i++) {
			if(cmps[i].cmpType == 'image') {
				if(cmps[i].file.key == obj.url) {
					cmps[i].file.key = url;
					cmps[i].file.url = res.key;
				}
			} else if(cmps[i].cmpType == 'shape') {
				if(cmps[i].src == obj.url) {
					cmps[i].src = url;
				}
			}
			
		}
		return uploadImgs(rabbit, imgList, cmps);
    });
}

function getFormCmps(obj) {

}

module.exports = insertRabbitPage;