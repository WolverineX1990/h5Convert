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

function insertRabPage(rabbit, pages) {
	var rabPages = [];
	for(var i = 0;i<pages.length;i++) {
		var page = perfectPageJson(pages[i], rabbit.data);
		rabPages.push(page);
	}
	rabbit.data.pages = rabPages;
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
	var json = {
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
					json.animation.push(anim);
				} else {
					console.log('anim:'+aniType[anim.type].name+'direction-'+anim.direction+'not found!');	
				}
			} else {
				console.log('anim-type-direction'+anim.type+'-'+anim.direction+'not found!');
			}
		}
	}

	if(compJson.type == 2) {

	} else if(compJson.type == 3) {

	} else if(compJson.type == 4) {
		
	} else if(compJson.type == 'h') {
		
	} else if(compJson.type == 8) {
		
	}  else if(compJson.type == 'm') {
		
	} else if(compJson.type == 5) {
		
	} else if(compJson.type == 501) {
		
	} else if(compJson.type == 502) {
		
	} else if(compJson.type == 503) {
		
	} else if(compJson.type == 6) {
		
	} else if(compJson.type == 601) {
		
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

module.exports = insertRabPage;