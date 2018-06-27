import getJson from "./RabCmp";
import Rabbit from "../Rabbit";

export default function(data, rabbit: Rabbit) {
  let json = getJson(data);
  json['required'] = data.properties.required;
  json['text'] = json['nickname'] = json['name'] = data.properties.placeholder;
  let types = json.type.split('-');
  json.type = types[0];
  json['inptype'] = types[1] || '';
  rabbit.setGather(json.id, json.text);
  return Promise.resolve(json);
}