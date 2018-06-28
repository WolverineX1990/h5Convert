import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
	json.style['line-height'] = data.css.height;
	json.style['height'] = 'auto';
	json.text = data.properties.title;
	json.trigger = [{
		event: 'click',
		go: '',
		link: data.properties.url,
		prehide: false,
		tips: false,
		toggle: '',
		type: 'link'
	}];
	let types = json.type.split('-');
  json.type = types[0];
  return Promise.resolve(json);
}