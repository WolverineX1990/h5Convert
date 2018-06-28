import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
	json.style['line-height'] = data.css.height;
	json.style['height'] = 'auto';
	json.text = data.text;
	let types = json.type.split('-');
  json.type = types[0];
  return Promise.resolve(json);
}