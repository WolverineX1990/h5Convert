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
		'bgcolor': '',
		'bgpic': '',
		'bgpicheight': '',
		'bgpicleft': 0,
		'bgpictop': '',
		'bgpicwidth': '640',
		'content': []
	};
	var elements = pageJson.elements;
	for(var i = 0;i<elements.length;i++) {
		json.content.push(perfectCompJson(elements[i]));
	}

	return json;
}

function perfectCompJson(compJson) {
	var json = {
		'type': compTypes[compJson.type],
		'height': 1,
		'w': 640,
		'left': 0,
		'top': 100,
		'selfH': 72,
		'selfW': 640,
		'opacity': 0.72,
		'borderradius': '',
		'boxshadow': '',
		'border-color': '',
		'border-width': '',
		'con': '',
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
			'cropData' {
				'height': 0,
				'widht': 0,
				'left': 0,
				'top': 0
			},
			'picid': '',
			'editable': true,
			'inh': 0,
			'inleft': 0,
			'intop': 0,
			'inw': 0,
			"shape": 0,
			'stylecolor': '',
			'styleopacity': 0,
			'version': 1
		});
	} else if(compJson.type == 3) {

	} else if(compJson.type == 'h') {

	}

	return json;
}

module.exports = insertMakaPage;