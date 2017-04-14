var extend = require('./../utils').extend;
var fileHost = 'http://res.eqh5.com/';
var compTypes = {
	'4': 'pic',
	// 'h': '',
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
		'bgpicheight': 1010,
		'bgpicleft': 0,
		'bgpictop': 0,
		'bgpicwidth': 640,
		'content': [],
		"effect": "cubedown"
	};
	var elements = pageJson.elements;
	for(var i = 0;i<elements.length;i++) {
		if(elements[i].type == 3) {
			var url = elements[i].properties.imgSrc;
			var reg = /^http/;
			if(reg.test(url)) {
				json.bgpic = url;
			} else {
				json.bgpic = fileHost + url;
			}
		} else {
			var cmp = perfectCompJson(elements[i]);
			if(cmp) {
				json.content.push(cmp);	
			}
		}		
	}

	return json;
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
		'elementAnimations': [],
	};

	if(compJson.type == 2) {
		extend(json, {
			'fontId': '',
			'fontTag': '',
			'fontUrl': '',
			'con': 'test',//compJson.content,
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
		})
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
			"shape": 0,
			'stylecolor': '',
			'styleopacity': 0,
			'version': 1
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
			if(cmps[i].picid == obj.url) {
				cmps[i].picid = res.replace('http://makapicture.oss-cn-beijing.aliyuncs.com/', '');
				cmps.splice(i, 1);
				i--;
			}
		}
		return uploadImgs(maka, imgList, cmps);
    });
}

module.exports = insertMakaPage;