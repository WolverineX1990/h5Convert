var extend = require('./../utils').extend;
var aniType = require('./aniType');
var fileHost = 'http://res.eqh5.com/';
var compTypes = {
	'4': 'pic',
	'h': 'pshape',
	'501': 'newForm',
	'502': 'newForm',
	'503': 'newForm',
	'6': 'newForm',
	'm': 'map',
	'2': 'ptext'
};

function insertMakaPage(maka, pages) {
	var makaPages = [];
	for(var i = 0;i<pages.length;i++) {
		var page = perfectPageJson(pages[i]);
		makaPages.push(page);
	}
	maka.jsonData.data.pdata.json = makaPages;
	return uploadRes(maka, makaPages).then(res=>maka.save());
}

function perfectPageJson(pageJson) {
	var json = {
		'bgcolor': 'rgba(250,250,250,1)',
		'bgpic': '',
		'bgpicheight': 'auto',
		'bgpicleft': 0,
		'bgpictop': 0,
		'bgpicwidth': 640,
		'content': [],
		'effect': 'cubedown',
		'lock': false,
		'opacity': 1,
		'version': 1
	};
	var elements = pageJson.elements;
	var newForm;
	for(var i = 0;i<elements.length;i++) {
		if(elements[i].type == 3) {
			var url = elements[i].properties.imgSrc;
			var reg = /^http/;
			if(reg.test(url)) {
				json.bgpic = url;
			} else {
				json.bgpic = fileHost + url;
			}
		} else if(compTypes[elements[i].type] == 'newForm') {
			getNewForm(newForm, elements[i]);
		} else {
			var cmp = perfectCompJson(elements[i]);
			if(cmp) {
				json.content.push(cmp);
			}
		}		
	}

	if(newForm) {
		json.content.push(newForm);
	}

	return json;
}

function getNewForm(formObj, compJson) {
	if(!formObj) {
		formObj = {
			  'opacity': 1,
			  'elementAnimations': {},
			  'left': 9,
			  'btnColor': '#18ccc0',
			  'h': 588,
			  'type': 'newForm',
			  'rotate': '0',
			  'selfH': 404,
			  'formid': Date.now(),
			  'selfW': 640,
			  'boxshadow': 0,
			  'top': 229,
			  'textColor': '#4B4B4B',
			  'w': 640,
			  'inputs': []
		}
	}

	if(compJson.type == 6) {
		formObj.submit = {
			'color': '#ffffff',
		    'height': 72,
		    'background': '#18ccc0',
		    'fontSize': 32,
		    'padding': 40,
		    'str': compJson.properties.title,
		    'beforeStr': compJson.properties.text || '谢谢您的参与！',
		    'top': 488,
		    'textAlign': 'center',
		    'lineHeight': 72,
		    'borderRadius': 8
		};
	} else {
		var obj = {
			  'strPadding': 20,
		      'color': '#ffffff',
		      'inputType': 'name',
		      'require': true,
		      'moduleType': 'textfield',
		      'moduleId': Date.now(),
		      'height': 72,
		      'border': 2,
		      'background': '#fcfcfc',
		      'fontSize': 28,
		      'padding': 40,
		      'str': compJson.properties.placeholder,
		      'top': 28,
		      'regularType': 'normal',
		      'lineHeight': 72,
		      'borderRadius': 8
		};
		formObj.inputs.push(obj);
	}
}

function perfectCompJson(compJson) {
	var json = {
		'type': compTypes[compJson.type],
		'h': 1,
		'w': compJson.css.width*2,
		'left': compJson.css.left*2,
		'top': compJson.css.top*2,
		'selfH': compJson.css.height*2,
		'selfW': compJson.css.width*2,
		'opacity': compJson.css.opacity,//0.72
		'borderradius': compJson.css.borderRadius,
		'boxshadow': compJson.css.boxShadow,
		'border-color': compJson.css.borderColor,
		'border-width': compJson.css.borderWidth,
		'lineheight': 1.2,
		'prepara': 0,
		'rotate': 0,
		'elementAnimations': {},
	};
	try{
		if(compJson.properties && compJson.properties.anim && compJson.properties.anim.length > 0) {
			var anim = compJson.properties.anim[0];
			if(aniType[anim.type]) {
				var animObj = aniType[anim.type][anim.direction];
				if(animObj && animObj.maka) {
					json.elementAnimations = {
						'animation_in': {
							'show': animObj.maka,
							'delay': anim.delay,
							'speed': anim.duration * 1000
						}
					};
				} else {
					console.log('anim:'+aniType[anim.type].name+'direction-'+anim.direction+'not found!');	
				}
			} else {
				console.log('anim-type-direction'+anim.type+'-'+anim.direction+'not found!');
			}
		}
	}catch(e) {
		console.log(e);
	}

	if(compJson.type == 2) {
		extend(json, {
			'fontId': '',
			'fontTag': '',
			'fontUrl': '',
			'con': compJson.content,
			'fontVersion': 10,
			'fontbold': false,
			'fontitalic': false,
			'ftcolor': '#000',
			'ftsize': 60,
			'textalign': 'center',
			'textvalign': 'middle',
			'udl': false,
			'tl': 60,
			'afterpara': 0,
			'version': 21
		});
	} else if(compJson.type == 4) {
		var url = compJson.properties.src;
		var reg = /^http/;
		if(!reg.test(url)) {
			url = fileHost + url;
		}
		extend(json, {
			'cropData': {
				'height': 0,
				'width': 0,
				'left': 0,
				'top': 0
			},
			'h': compJson.css.height*2,
			'picid': url,
			'editable': true,
			'inh': compJson.css.height*2,
			'inleft': 0,
			'intop': 0,
			// 'orgHeight': ,
			// 'orgWidth': ,
			'inw': compJson.css.width*2,
			'shape': 0,
			'stylecolor': '',
			'styleopacity': 0,
			'version': 1
		});
	} else if(compJson.type == 'h') {
		var url = compJson.properties.src;
		var reg = /^http/;
		if(!reg.test(url)) {
			url = fileHost + url;
		}
		extend(json, {
			'h': compJson.css.height*2,
			'shape': url,
			'colorScheme': {},
			'svgHTML': {
				'0': {},
				'length': 1
			}
		});
	} else if(compJson.type == 'm') {
		extend(json, {
			'h': compJson.css.height*2,
			'latlng': {
				'lat': 1,
				'lng': 1
			},
			'addr': '',
			'zoom': 0,
			'setZoom': 16,
			'id': ''
		});
	} else {
		console.log(compJson.type + ':not found!');
		return null;
	}

	return json;
}

function uploadRes(maka, pages) {
	var list = [];
	var imgList = [];
	var urls = [];
	for(var i = 0;i<pages.length;i++) {
		var cmps = pages[i].content;
		for(var j = 0;j<cmps.length;j++) {
			var cmp = cmps[j];
			if(cmp.type === 'pic') {
				if(urls.indexOf(cmp.picid) === -1) {
					urls.push(cmp.picid);
					imgList.push({
						url: cmp.picid
					});
				}
				list.push(cmp);
			} else if(cmp.type === 'pshape') {
				if(urls.indexOf(cmp.shape) === -1) {
					urls.push(cmp.shape);
					imgList.push({
						url: cmp.shape
					});
				}
				list.push(cmp);
			}
		}
	}
	if(list.length) {
		return uploadImgs(maka, imgList, list);
	} else {
		var promise = new Promise(function func(resolve, reject){
			resolve();
		});
		return promise;
	}
}

function uploadImgs(maka, imgList, cmps) {
	var obj = imgList.shift();
	if(!obj) {
		var promise = new Promise(function func(resolve, reject){
			resolve();
		});
		return promise;
	}
	return maka.uploadImg(obj).then(res => {
		for(var i = 0;i < cmps.length;i++) {
			if(cmps[i].type == 'pic') {
				if(cmps[i].picid == obj.url) {
					cmps[i].picid = res.replace('http://makapicture.oss-cn-beijing.aliyuncs.com/', '');
					cmps.splice(i, 1);
					i--;
				}
			} else if(cmps[i].type == 'pshape') {
				if(cmps[i].shape == obj.url) {
					cmps[i].shape == res;
					cmps.splice(i, 1);
					i--;
				}
			}
			
		}
		return uploadImgs(maka, imgList, cmps);
    });
}

module.exports = insertMakaPage;