import getJson from "./RabCmp";

export default function(data) {
	let json = getJson(data);
	json.style['lineHeight'] = getLineHeight(data.css);
	json.style['height'] = 'auto';
	json['isRichText'] = true;
	let ss = data.content;
	ss = ss.replace(/&nbsp;/g,' ');
	ss = ss.replace(/秀秀/g,'兔展');
	ss = ss.replace(/中网易企秀/g,'XXX');
	ss = ss.replace(/易企秀/g,'兔展');
	ss = ss.replace(/一起秀/g,'兔展');
	ss = ss.replace(/www.eqxiu.com/, 'www.rabbit.com');
	json.text = ss;
	let types = json.type.split('-');
  json.type = types[0];
  return Promise.resolve(json);
}

function getLineHeight (css) {
	let fontSize = 16;
	if (css.fontSize) {
		fontSize = parseInt(css.fontSize);
	}

	if (css.lineHeight) {
		let val = Math.ceil(css.lineHeight * fontSize);
		return val;
	}

	return 18;
}