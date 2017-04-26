var extend = require('./../utils').extend;
var aniType = require('./aniType');
var fileHost = 'http://res.eqh5.com/';
var compTypes = {
	'4': 'image',
	'3': 'image',
	'h': 'shape',
	'501': 'ginput',
	'502': 'ginput',
	'503': 'ginput',
	'5': 'ginput',
	'6': 'gsubmit',
	'601': 'gsubmit',
	'm': 'map',
	'2': 'text',
	'8': 'onecall'//,
	// 'l': 'text'
};

function insertRabbitPage(rabbit, pages) {
	var rabPages = [];
	for(var i = 0;i<pages.length;i++) {
		var page = perfectPageJson(pages[i], rabbit.data);
		rabPages.push(page);
	}
	rabbit.data.pages = rabPages;
	return rabbit.save();
	// return uploadRes(maka, makaPages).then(res=>maka.save());
}

function perfectPageJson(pageJson, rabbitData) {
	var json = {
		appid: rabbitData.id,
		row: 0,
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
	var elements = pageJson.elements;
	var newForm;
	for(var i = 0;i<elements.length;i++) {
		var cmp = perfectCompJson(elements[i]);
		if(cmp) {
			json.cmps.push(cmp);
		}		
	}

	return json;
}

function perfectCompJson(compJson) {
	var newJson = {
		tid: randomId(),
		style: getStyle(compJson.css),
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
					var count = anim.count == 1 ? 'infinite' : anims[i].countNum;
					var anim = {
						name: animObj.rabbit,
						count: count,
						delay: anims[i].delay
					};
					newJson.animation.push(anim);
				} else {
					console.log('anim:'+aniType[anim.type].name+'direction-'+anim.direction+'not found!');	
				}
			} else {
				console.log('anim-type-direction'+anim.type+'-'+anim.direction+'not found!');
			}
		}
	}

	if(compJson.type == 2) {
		newJson.text = compJson.content;
		// newJson.css.lineHeight = 1;
		// newJson.css.width = newJson.css.width + 30;
		// newJson.css.left = newJson.css.left - 15;
		// newJson.css.top = newJson.css.top - 7;
	} else if(compJson.type == 3) {
		newJson.file = {
			url: compJson.properties.imgSrc,
			key: compJson.properties.imgSrc,
			server: 'Q'
		};
	} else if(compJson.type == 4) {
		newJson.file = {
			url: compJson.properties.src,
			key: compJson.properties.src,
			server: 'Q'
		};
	} else if(compJson.type == 'h') {
		newJson.fill = [];
		if(newJson.properties && newJson.properties.items) {
			var items = newJson.properties.items;
			for (var j = 0; j < items.length; j++) {
				newJson.fill.push(items[i].file);
			}
		}
		newJson.src = compJson.properties.src;
	} else if(compJson.type == 8) {
		newJson.telNum = compJson.properties.title;
	} else if(compJson.type == 'm') {
		
	} else if(compJson.type == 5) {
		newJson.required = compJson.properties.required;
		newJson.name = compJson.properties.placeholder;
	} else if(compJson.type == 501) {
		newJson.required = compJson.properties.required;
		newJson.name = compJson.properties.placeholder;
		newJson.inptype = 'name';
	} else if(compJson.type == 502) {
		newJson.required = compJson.properties.required;
		newJson.name = compJson.properties.placeholder;
		newJson.inptype = 'tel';
	} else if(compJson.type == 503) {
		newJson.required = compJson.properties.required;
		newJson.name = compJson.properties.placeholder;
		newJson.inptype = 'email';
	} else if(compJson.type == 6) {
		newJson.text = compJson.properties.title;
		newJson.message = compJson.properties.text;
	} else if(compJson.type == 601) {
		newJson.text = compJson.properties.title;
		newJson.message = compJson.properties.text;
	} else {
		console.log(compJson.type + ' not found')
	}

	return json;
}

function getStyle(css) {
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

	if(css.lineHeight) {
		style['line-height'] = css.lineHeight
	}

	if(css.textAlign) {
		style['text-align'] = css.textAlign;
	}

	if(css.backgroundColor) {
		style['background-color'] = css.backgroundColor;
	}

	if(css.borderColor) {
		style['border-color'] = css.borderColor;
	}

	if(css.borderRadius) {
		style['border-radius'] = css.borderRadius;
	}

	if(css.borderStyle) {
		style['border-style'] = css.borderStyle;
	}

	if(css.borderWidth) {
		style['border-width'] = css.borderWidth;
	}

	if(css.fontSize) {
		style['font-size'] = css.fontSize;
	}

	return style;
}

function randomId() {
    return Math.ceil(Math.random() * 10000000000);
}

module.exports = insertRabbitPage;