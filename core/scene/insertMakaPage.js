var extend = require('./../utils').extend;
var compTypes = {
	'4': 'pic',
	'h': '',
	'2': 'ptext'
};

function insertMakaPage(maka, pages) {
	for(var i = 0;i<pages.length;i++) {
		var page = perfectPageJson(pages[i]);
	}
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
			json.bgpic = elements[i].properties.imgSrc;
		} else {
			json.content.push(perfectCompJson(elements[i]));	
		}		
	}

	return json;
}

function perfectCompJson(compJson) {
	var json = {
		'type': compTypes[compJson.type],
		'height': 1,
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
		})
	} else if(compJson.type == 4) {
		extend(json, {
			'cropData': {
				'height': 0,
				'width': 0,
				'left': 0,
				'top': 0
			},
			'height': compJson.css.height*2,
			'picid': compJson.properties.src,
			'editable': true,
			'inh': compJson.css.height*2,
			'inleft': 0,
			'intop': 0,
			'inw': compJson.css.width*2,
			"shape": 0,
			'stylecolor': '',
			'styleopacity': 0,
			'version': 1
		});
	} else if(compJson.type == 'h') {

	}

	return json;
}

module.exports = insertMakaPage;