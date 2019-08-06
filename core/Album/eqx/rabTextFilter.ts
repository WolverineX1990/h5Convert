import getJson from "./RabCmp";

export default function(data) {
	let json = getJson(data);
	delete json.style['line-height'];
	json.style['lineHeight'] = getLineHeight(data.css);
	json.style['height'] = 'auto';
	json['isRichText'] = true;
	let ss = data.content;
	ss = ss.replace(/&nbsp;/g,'我们');
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