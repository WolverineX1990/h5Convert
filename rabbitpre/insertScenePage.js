var aniTypes = require('./aniTypes');
var compTypes = {
	'image': 4,
	'text': 2
};

function insertScenePage(scene, pageJson) {
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

function perfectJson(pageJson) {
	var elements = pageJson.elements;
	var promise = new Promise(function func(resolve, reject){
		try {
			for(var i = 0;i < elements.length;i++) {
				var eleJson = elements[i];
				if(compTypes[eleJson.cmpType]) {
					var newJson = {
						id: randomId(),
						type: compTypes[eleJson.cmpType]
					};
					newJson.css = eleJson.style;
					newJson.css.position = undefined;
					if(eleJson.cmpType == 'image') {
						newJson.properties = {
							src: eleJson.file.key
						};
					} else if(eleJson.cmpType == 'text') {
						newJson.content = eleJson.text;
						newJson.css.height = 'auto';
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
			if(cmps[i].properties.src == url) {
				cmps[i].properties.src = key;
			}
		}
		return uploadImgs(scene, imgList, cmps);
    });
}

module.exports = insertScenePage;