import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
  json['telNum'] = data.properties.title;
  return Promise.resolve(json);
}