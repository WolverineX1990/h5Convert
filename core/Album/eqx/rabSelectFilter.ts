import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
  json['required'] =false;
	json['nickname'] = json['name'] = data.showText;
	let items = [];
	let choices = JSON.parse(data.choices).options;
  for(var i = 0;i< choices.length;i++) {
    items.push({value:choices[i].label, name: choices[i].label, children:[]});
  }
  json.type = 'gselect';
	json['selector'] = JSON.stringify({label: data.showText,options: items});
  return Promise.resolve(json);
}