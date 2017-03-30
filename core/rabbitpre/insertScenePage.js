var aniTypes = require('./aniTypes');
//bg 是自己加的类型
var compTypes = {
	'image': 4,
	'text': 2,
	'onecall': 8,
	'map': 'm',
	'bg': 3
};


function insertScenePage(scene, pageJson) {
	if(pageJson.bgimage) {
		pageJson.cmps.push({
				id: randomId(),
				cmpType: 'bg',
				style: {},
				properties: {
					imgSrc: pageJson.bgimage
				}
			});
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
		scene.currentPage.elements = pageJson.cmps;
		return perfectJson(scene.currentPage).then(res=>{
			return uploadRes(scene, res).then(res1=>{
				scene.savePage(res1)
			});
		});	
	} catch(err) {
		console.log(err);
	}
}

var base = 23.4375 / 20;

function perfectJson(pageJson) {
	var elements = pageJson.elements;
	var promise = new Promise(function func(resolve, reject){
		try {
			for(var i = 0;i < elements.length;i++) {
				var eleJson = elements[i];
				if(compTypes[eleJson.cmpType]) {
					var newJson = {
						id: eleJson.tid,
						// name: eleJson. tid,
						type: compTypes[eleJson.cmpType],
					};

					newJson.css = eleJson.style;
					newJson.css.zIndex = i + 1
					newJson.css.position = undefined;
					if(eleJson.cmpType == 'image') {
						newJson.properties = {
							src: eleJson.file.url || eleJson.file.key
						};
					} else if(eleJson.cmpType == 'text') {
						var fontSizeReg = /font-size:([\d|\s]*)px/;
						var fontFamilyReg = /font-family: 微软雅黑/;
						newJson.css.height = newJson.css['line-height'] + 14;
						var text = eleJson.text.replace(fontFamilyReg, '');
						newJson.content = text;
						if(fontSizeReg.test(eleJson.text)) {
							newJson.css.lineHeight = eleJson.text.match(fontSizeReg)[1] + 'px';
						} else {
							newJson.css.lineHeight = '24px';
						}
						newJson.css.width = newJson.css.width + 30;
						newJson.css.left = newJson.css.left - 15;
						newJson.css.top = newJson.css.top - 7;
						newJson.css['line-height'] = undefined;
					} else if(eleJson.cmpType == 'onecall') {
						newJson.properties = {
							title:  eleJson.telNum
						};
					} else if(eleJson.cmpType == 'map') {

					}
					extendComJson(newJson, eleJson);
					elements[i] = newJson;
				} else {
					console.log('type:"'+eleJson.cmpType+'" not found!');
				}
			}
			resolve(pageJson);
		} catch (e){
			reject(e);
		}
		
	});
	return promise;
}

function randomId() {
    return Math.ceil(Math.random() * 10000000000);
}

function extendComJson(comJson, tzJson) {
	comJson.properties = comJson.properties || {};
	var anims = comJson.properties.anim = []; 
	if(tzJson.animation) {
		if(tzJson.animation instanceof Array) {
			for(var i = 0;i< tzJson.animation.length;i++) {
				var anim = tzJson.animation[i];
				if(anim.name && anim.name != 'none') {
					var obj = aniTypes[anim.name];
					if(!obj) {
						obj = {
							type: 0,
							direction: 0
						}
						console.error('animation:"' + anim.name + '" not found!');
					}
					var count = anim.count == 'infinite' ? 1 : 0;
					anims.push({
						count: count,
						countNum: anim.count || 1,
						delay: anim.delay || 0,
						direction: obj.direction,
						duration: anim.duration || 1,
						interval: 0,//打字机用
						type: obj.type
					});
				}
			}
		} else {
			if(tzJson.animation.name && tzJson.animation.name != 'none') {
				var obj = aniTypes[tzJson.animation.name];
				if(!obj) {
					obj = {
						type: 0,
						direction: 0
					}
					console.error('animation:"' + tzJson.animation.name + '"not found!');
				}
				var count = tzJson.animation.count == 'infinite' ? 1 : 0;
				anims.push({
					count: count,
					countNum: tzJson.animation.count || 1,
					delay: tzJson.animation.delay || 0, //延迟
					direction: obj.direction,
					duration: tzJson.animation.duration || 1,
					interval: 0,//打字机用
					type: obj.type
				});
			}
		}
	}
}

function uploadRes(scene, pageJson) {
	var elements = pageJson.elements;
	var list = [];
	var imgList = [];
	for(var i = 0;i<elements.length;i++) {
		if(elements[i].type == 4 && elements[i].properties.src.indexOf('rabbitpre') > -1) {
			if(imgList.indexOf(elements[i].properties.src) == -1) {
				imgList.push(elements[i].properties.src);
			}
			list.push(elements[i]);
		} else if(elements[i].type == 3) {
			imgList.push(elements[i].properties.imgSrc);
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
	var url = imgList.shift();
	if(!url) {
		var promise = new Promise(function func(resolve, reject){
			resolve(scene.currentPage);
		});
		return promise;
	}
	return scene.uploadImg(url).then(res => {
		var key = JSON.parse(res).key;
		for(var i = 0;i < cmps.length;i++) {
			if(cmps[i].type == 4) {
				if(cmps[i].properties.src == url) {
					cmps[i].properties.src = key;
				}
			} else if(cmps[i].type == 3) {
				if(cmps[i].properties.imgSrc == url) {
					cmps[i].properties.imgSrc = key;
				}
			}
		}
		return uploadImgs(scene, imgList, cmps);
    });
}

module.exports = insertScenePage;