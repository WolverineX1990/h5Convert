import getJson from "./RabCmp";
import Rabbit from "../Rabbit";

export default function(data, rabbit: Rabbit) {
  let json = getJson(data);
  json['text'] = data.properties.title;
	json['message'] = data.properties.text;
  json.style['text-align'] = 'center';
  let types = json.type.split('-');
  json.type = types[0];
  rabbit.setGather(json.id, json.text);
  return Promise.resolve(json);
}