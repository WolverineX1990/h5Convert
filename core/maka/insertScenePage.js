'use strict';
var aniTypes = require('./aniTypes');
var fileHost = 'http://res2.maka.im/shapeSVG/';
var imgHost = 'http://img2.maka.im/';
var compTypes = {
	'shape': 'h',
	'pic': '4',
	'pshape': 'h',
	'ptext': '2',
	'map': 'm'
};

function insertScenePage(scene, pageJson) {
	if(pageJson.bgimage) {
		var bgCmp = {
			id: randomId(),
			cmpType: 'bg',
			style: {
				width: 374,
				height: 520,
				top: -17,
				left: -27
			},
			properties: {
				src: pageJson.bgimage
			}
		};
		pageJson.cmps.splice(0, 0, bgCmp);
	}
	try {
		if(scene.currentPage) {
			return scene.insertPage().then(res1=>convertPage(scene, pageJson));
		} else {
			return scene.loadPages().then(res1=>convertPage(scene, pageJson));
		}
	} catch(err) {
		console.log(err);
	}
}

function convertPage(scene, pageJson) {
	try {
		scene.currentPage.elements = pageJson.content;
		return perfectJson(scene.currentPage).then(res=>{
			return uploadRes(scene, res).then(res1=>scene.savePage(res1));
		});	
	} catch(err) {
		console.log(err);
	}
}

function perfectJson(pageJson) {
	var elements = pageJson.elements;
	var promise = new Promise(function func(resolve, reject){
		try {
			for(var i = 0;i < elements.length;i++) {
				var eleJson = elements[i];
				if(compTypes[eleJson.type]) {
					var newJson = {
						id: eleJson.tid || randomId(),
						type: compTypes[eleJson.type],
					};

					newJson.css = getStyle(eleJson);
					
					newJson.css.zIndex = i + 1;
					if(eleJson.type == 'pic') {
						var url = eleJson.picid;
						var reg = /^http/;
						if(!reg.test(url)) {
							url = imgHost + url;
						}
						newJson.properties = {
							src: url
						};
					} else if(eleJson.type == 'ptext') {
						// var fontFamilyReg = /font-family: 微软雅黑/;
						// newJson.css.height = eleJson.style['line-height'] + 14;
						// var text = eleJson.text.replace(fontFamilyReg, '');
						newJson.content = eleJson.con;
						newJson.css.lineHeight = 1;
						newJson.css.width = newJson.css.width + 30;
						newJson.css.left = newJson.css.left - 15;
						newJson.css.top = newJson.css.top - 7;
					} else if(eleJson.cmpType == 'map') {

					} else if(eleJson.type == 'pshape') {
						var url = eleJson.shape;
						var reg = /^http/;
						if(!reg.test(url)) {
							url = fileHost + url;
						}
						newJson.properties = {
							src: url
						};
						if(eleJson.colorScheme) {
							newJson.properties.items = [];
							for (var key in eleJson.colorScheme) {
								newJson.properties.items.push({
									fill: eleJson.colorScheme[key]
								});
							}
						}
					} else if(eleJson.type == 'bg') {
						newJson.properties = {
							src: eleJson.properties.src
						};
					}
					extendComJson(newJson, eleJson);
					elements[i] = newJson;
				} else if(eleJson.type == 'newForm') {
					var cmps = getFormCmps(elements[i]);
				} else {
					console.log('type:"'+eleJson.type+'" not found!');
				}
			}
			resolve(pageJson);
		} catch (e){
			reject(e);
		}
		
	});
	return promise;
}

function getFormCmps() {

}

function getStyle(json, type) {
	var css = {
		height: json.h/2,
		width: json.w/2,
		top: json.top/2,
		left: json.left/2,
		rotate: json.rotate,
		opacity: json.opacity
	};

	if(json.textalign) {
		css.textAlign = json.textalign;
	}

	if(json.borderradius) {
		css.borderRadius = json.borderradius;
	}

	if(json.rotate) {
		css.transform = getRotateStr(json.rotate);
	}

	return css;
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

function extendComJson(comJson, makaJson) {
	comJson.properties = comJson.properties || {};
	var anims = comJson.properties.anim = [];
	if(makaJson.elementAnimations && makaJson.elementAnimations.animation_in) {
		var animation = makaJson.elementAnimations.animation_in;
		var animObj = aniTypes[animation.show];
		if(animObj && animObj.eqx) {
			var anim = {
				count: 1,
				countNum: animation.count || 1,
				delay: animation.delay || 0,
				direction: animObj.eqx.direction,
				duration: animation.duration || 1,
				interval: 0,//打字机用
				type: animObj.eqx.type
			};
			anims.push(anim);
		} else {
			console.log('anim:'+animation.show+' not found!');	
		}
	}
}

function uploadRes(scene, pageJson) {
	var elements = pageJson.elements;
	var list = [];
	var imgList = [];
	var urls = [];
	for(var i = 0;i<elements.length;i++) {
		if(elements[i].type == 4) {
			if(urls.indexOf(elements[i].properties.src) == -1) {
				imgList.push({
					url: elements[i].properties.src,
					type: 'image'
				});
				urls.push(elements[i].properties.src);
			}
			list.push(elements[i]);
		} else if(elements[i].type == 'h') {
			if(urls.indexOf(elements[i].properties.src) == -1) {
				imgList.push({
					url: elements[i].properties.src,
					type: 'svg'
				});
				urls.push(elements[i].properties.src);
			}
			list.push(elements[i]);
		}
	}
	if(list.length) {
		return uploadImgs(scene, imgList, list);
	} else {
		var promise = new Promise(function func(resolve, reject){
			resolve(pageJson);
		});
		return promise;
	}
}

function uploadImgs(scene, imgList, cmps) {
	var obj = imgList.shift();
	if(!obj) {
		var promise = new Promise(function func(resolve, reject){
			resolve(scene.currentPage);
		});
		return promise;
	}
	return scene.uploadImg(obj).then(res => {
		var key = JSON.parse(res).key;
		for(var i = 0;i < cmps.length;i++) {
			if(cmps[i].type == 4 || cmps[i].type == 'h') {
				if(cmps[i].properties.src == obj.url) {
					cmps[i].properties.src = key;
				}
			} else if(cmps[i].type == 3) {
				if(cmps[i].properties.imgSrc == obj.url) {
					cmps[i].properties.imgSrc = key;
				}
			}
		}
		return uploadImgs(scene, imgList, cmps);
    });
}

module.exports = insertScenePage;