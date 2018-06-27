import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
  json['coordinate'] = data.properties.lng + ',' + data.properties.lat;
  return Promise.resolve(json);
}