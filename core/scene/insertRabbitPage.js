'use strict';
var aniType = require('./aniType');
var utils = require('./../utils');
var cheerio = require('cheerio');
var fileHost = require('./../config').eqx.fileHost;
var compTypes = {
	'4': 'image',
	'3': 'image',
	'h': 'shape',
	'501': 'ginput',
	'502': 'ginput',
	'503': 'ginput',
	'504': 'ginput',
	'5': 'ginput',
	'6': 'gsubmit',
	'601': 'gsubmit',
	'm': 'map',
	'2': 'text',
	'8': 'onecall',
	'l': 'text',
	'i': 'praise',
	'z': 'gselect'
};

var upDownPageModes = [];

function insertRabbitPage(rabbit, pages, pageMode) {
	var rabPages = rabbit.data.pages;
	rabPages[0].deleted = true;
	for(var i = 0;i<pages.length;i++) {
		try{
			var direction = upDownPageModes.indexOf(pageMode) == -1;
			var page = perfectPageJson(pages[i], i, rabbit.data, direction);
			rabPages.push(page);
		} catch(e) {
			console.log(e);
		}
	}

	if(rabbit.data.gather) {
		rabbit.data.gather = JSON.stringify(rabbit.data.gather);
	}

	return uploadRes(rabbit, rabPages)
			.then(res=>setComps(rabbit))
			.then(res=>rabbit.save());
}

function setComps(rabbit) {
	var praiseCmps = [];
	var rabPages = rabbit.data.pages;
	for(var i = 0;i<rabPages.length;i++) {
		var cmps = rabPages[i].cmps;
		for(var j = 0;j<cmps.length;j++) {
			if(cmps[j].type == 'praise') {
				praiseCmps.push(cmps[j]);
			}
		}
	}
	if(praiseCmps.length) {
		return setCompsId(praiseCmps, rabbit);
	}
	return rabPages;
}

function setCompsId(praiseCmps, rabbit) {
	var cmp = praiseCmps.shift();
	if(cmp) {
		return rabbit.setCmpId(cmp).then(res=>setCompsId(praiseCmps, rabbit));
	} else {
		return rabbit;
	}
}

function perfectPageJson(pageJson, pageNum, rabbitData, direction) {
	var json = {
		appId: rabbitData.id,
		row: (direction ? pageNum : 0),
		col: (direction ? 0 : pageNum),
		in: null,
		out: null,
		bgCol: '#fff',
		bgImage: null,
		bgServer: null,
		bgLeft: 0,
		bgTop: 0,
		cmps: []
	};
	if(pageNum == 0 && rabbitData.bgmusic) {
		var bgmusic = rabbitData.bgmusic;
		json.cmps.push({
			id: randomId(),
			type: 'bgmusic',
			trigger: [],
			triggers: [],
			animations: [],
			autoPlay: true,
			musicBucket: bgmusic.musicBucket,
			musicKey: bgmusic.musicKey,
			musicName: bgmusic.musicName,
			musicServer: bgmusic.musicServer,
			musickId: bgmusic.musickId,
			switchOn: true,
			src: bgmusic.src,
			loopPlay: true,
			visible: true,
			style: {
				borderColor: "#000",
				borderStyle: "solid",
				borderWidth: 0,
				height: 30,
				left: 276,
				opacity: 1,
				rotate: 0,
				top: 14,
				width:30
			}
		});
	}
	var elements = pageJson.elements.sort((a, b)=>{
		var aIndex = a.css.zIndex;
		var bIndex = b.css.zIndex;
		return aIndex - bIndex;
	});
	for(var i = 0;i<elements.length;i++) {
		var cmp = perfectCompJson(elements[i]);
		if(cmp) {
			if(elements[i].type == 3) {
				if(elements[i].properties.bgColor) {
					pageJson.bgcol = elements[i].properties.bgColor;
				} else {
					json.cmps.splice(0, 0, cmp);
				}
			} else {
				try {
					var inputTypes = ['ginput', 'gselect'];
					if(inputTypes.indexOf(cmp.type)!=-1) {
						if(!rabbitData.gather) {
							rabbitData.gather = {id: 0, strict: {}};
						}
						rabbitData.gather.strict[cmp.id] = cmp.text;
					}
				}catch(e) {
					console.log(e);
				}
				json.cmps.push(cmp);
			}
		}		
	}

	return json;
}

function perfectCompJson(compJson) {
	var newJson = {
		id: randomId(),
		style: getStyle(compJson.css, compJson.type),
		trigger: [],
		triggers: [],
		animations: [],
		type: compTypes[compJson.type],
		visible: true
	};

	if(compJson.properties && compJson.properties.anim) {
		var anims = compJson.properties.anim;
		for (var i = 0; i <anims.length; i++) {
			if(aniType[anims[i].type]) {
				if(!anims[i].direction) {
					anims[i].direction = 0;
				}
				var animObj = aniType[anims[i].type][anims[i].direction];
				if(animObj && animObj.rabbit) {
					var count = anims[i].count == 1 ? 'Infinity' : anims[i].countNum;
					var anim = {
						animate: animObj.rabbit,
						count: count,
						delay: anims[i].delay,
						duration: anims[i].duration || 1,
						isActive: true,
						interval: 0,
						isCompose: false,
						name: animObj.rabbit,
						order: 'normal'
					};
					newJson.animations.push(anim);
				} else {
					console.log('id:' + compJson.id + '-anim:'+aniType[anims[i].type].name+'direction-'+anims[i].direction+'not found!');	
				}
			} else {
				if(anims[i].type != -1) {
					console.log('id:' + compJson.id + '-anim-type-direction'+anims[i].type+'-'+anims[i].direction+'not found!');
				}
			}
		}

	}

	if(compJson.type == 2) {
		newJson.isRichText = true;
		newJson.text = getText(compJson.content);
		newJson.style.height = 'auto';
		newJson.style['font-family'] = '黑体';
		var reg = /font-family:[^\:]*?\;/;
		newJson.text = newJson.text.replace(reg, '');
	} else if(compJson.type == 3) {
		var url = compJson.properties.imgSrc;
		var reg = /^http/;
		if(!reg.test(url)) {
			url = fileHost + url;
		}
		newJson.src = url;
		newJson.style.left = -14;
		newJson.style.top = -9;
		newJson.style.width = 348;
		newJson.style.height = 524;

		newJson.crop = newJson.display = {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			width: newJson.style.width,
			height: newJson.style.height
		};

		newJson.fullSize = {
			width: newJson.style.width,
			height: newJson.style.height
		};
	} else if(compJson.type == 4) {
		var url = compJson.properties.src;
		var reg = /^http/;
		if(!reg.test(url)) {
			url = fileHost + url;
		}
		newJson.crop = newJson.display = {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			width: newJson.style.width,
			height: newJson.style.height
		};

		newJson.fullSize = {
			width: newJson.style.width,
			height: newJson.style.height
		};
		newJson.src = url;
	} else if(compJson.type == 'h') {
		newJson.fill = [];
		var url = compJson.properties.src;
		if(url == 'group1/M00/B1/A3/yq0KXFZysi-ACYaKAAACDQH4Nes625.svg') {
			url = 'http://wscdn.rabbitpre.com/3fe3893e-11fb-474b-b501-c753e922a3a0-3161';
		} else if(url == 'group1/M00/B1/A3/yq0KXFZysi2AWB5GAAACGXEBTuA328.svg') {
			url = 'http://wscdn.rabbitpre.com/e77a9116-c5a4-4f28-bbce-5fbc40c75432-6656';
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
	} else if(compJson.type == 8) {
		newJson.telNum = compJson.properties.title;
	} else if(compJson.type == 'm') {
		newJson.coordinate = compJson.properties.lng + ',' + compJson.properties.lat;
	} else if(compJson.type == 5 || compJson.type == 504) {
		newJson.required = compJson.properties.required;
		newJson.text = newJson.nickname = newJson.name = compJson.properties.placeholder;
	} else if(compJson.type == 501) {
		newJson.required = compJson.properties.required;
		newJson.text = newJson.nickname = newJson.name = compJson.properties.placeholder;
		newJson.inptype = 'name';
	} else if(compJson.type == 502) {
		newJson.required = compJson.properties.required;
		newJson.text = newJson.nickname = newJson.name = compJson.properties.placeholder;
		newJson.inptype = 'tel';
	} else if(compJson.type == 503) {
		newJson.required = compJson.properties.required;
		newJson.text = newJson.nickname = newJson.name = compJson.properties.placeholder;
		newJson.inptype = 'email';
	} else if(compJson.type == 'z') {
		newJson.required =false;
		newJson.nickname = newJson.name = compJson.showText;
		var items = [];
		var choices = JSON.parse(compJson.choices).options;
		for(var i = 0;i< choices.length;i++) {
			items.push({value:choices[i].label, name: choices[i].label, children:[]});
		}
		newJson.selector = JSON.stringify({label: compJson.showText,options: items});
	} else if(compJson.type == 6) {
		newJson.text = compJson.properties.title;
		newJson.message = compJson.properties.text;
		newJson.style['text-align'] = 'center';
	} else if(compJson.type == 601) {
		newJson.text = compJson.properties.title;
		newJson.message = compJson.properties.text;
	} else if(compJson.type == 'l') {
		newJson.style['line-height'] = compJson.css.height;
		newJson.text = '<div>'+compJson.properties.title+'</div>';
		newJson.trigger = [{
							event: 'click',
							go: '',
							link: compJson.properties.url,
							prehide: false,
							tips: false,
							toggle: '',
							type: 'link'
						}];
	} else if(compJson.type == 'i') {
		console.log(compJson);
		newJson.content = {
			icon: 'diao',
			img: '',
			num: 0,
			state: 'icon'
		};
		newJson.layout = 'landscape';
		newJson.style.height = 'auto';
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
			if(cmp.type === 'image') {
				if(urls.indexOf(cmp.src) === -1) {
					urls.push(cmp.src);
					imgList.push({
						url: cmp.src,
						type: 'image'
					});
				}
				list.push(cmp);
			} else if(cmp.type === 'shape' && cmp.src.indexOf('wscdn.rabbitpre.com') == -1) {
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
		var promise = new Promise(function(resolve, reject){
			resolve();
		});
		return promise;
	}
}

function uploadImgs(rabbit, imgList, cmps) {
	var obj = imgList.shift();
	if(!obj) {
		var promise = new Promise(function(resolve, reject){
			resolve();
		});
		return promise;
	}
	return rabbit.uploadRes(obj).then(res => {
		var url = '//tenc1.rabbitpre.com/' + res.key;
		for(var i = 0;i < cmps.length;i++) {
			if(cmps[i].type == 'image') {
				if(cmps[i].src == obj.url) {
					cmps[i].src = url;
				}
			} else if(cmps[i].type == 'shape') {
				if(cmps[i].src == obj.url) {
					cmps[i].src = url;
				}
			}
			
		}
		return uploadImgs(rabbit, imgList, cmps);
    });
}

function getText(text) {
	var reg = /([^>]*)/;
	var ss = '';
	if(reg.test(text)) {
	  ss = text.match(reg)[1];
	}
	var $ = cheerio.load(text);
	if($('div').length == 1) {
		if(ss) {
			var reg1 = /style="([^"]*)/;
			if(reg1.test(ss)) {
			  	var mm = ss.match(reg1)[1];
			  	var ss1 = ss.replace(mm, mm + ';padding:7px 15px;');
			  	ss = text.replace(ss, ss1);
			} else {
				var append = ' style="padding:7px 15px;"'
				ss = text.replace(ss, ss + append);
			}
		} else {
			ss = '<div style="padding:7px 15px;">' + text +'</div>';
		}	
	} else {
		ss = '<div style="padding:7px 15px;">' + text +'</div>';
	}

	ss = ss.replace(/秀秀/g,'我们');
	ss = ss.replace(/中网易企秀/g,'XXX');
	ss = ss.replace(/易企秀/g,'兔展');
	ss = ss.replace(/www.eqxiu.com/, 'www.rabbit.com');
	
	return ss;
}

module.exports = insertRabbitPage;