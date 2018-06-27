import getJson from "./RabCmp";
import CONFIG from "../../const/CONFIG";
import Rabbit from "../Rabbit";

export default function(data, rabbit: Rabbit) {
  let json = getJson(data);
  json['fill'] = [];

  if(data.properties && data.properties.items) {
    var items = data.properties.items;
    for (var i = 0; i < items.length; i++) {
      json['fill'].push(items[i].fill);
    }
  }

  var url = data.properties.src;

  if(url == 'group1/M00/B1/A3/yq0KXFZysi-ACYaKAAACDQH4Nes625.svg') {
    json['src'] = 'http://wscdn.rabbitpre.com/3fe3893e-11fb-474b-b501-c753e922a3a0-3161';
    return Promise.resolve(json);
  } else if(url == 'group1/M00/B1/A3/yq0KXFZysi2AWB5GAAACGXEBTuA328.svg') {
    json['src'] = 'http://wscdn.rabbitpre.com/e77a9116-c5a4-4f28-bbce-5fbc40c75432-6656';
    return Promise.resolve(json);
  }

  var reg = /^http/;
  if(!reg.test(url)) {
    url = CONFIG.eqxReSHOST + url;
  }

  return rabbit.uploadSvg(url)
            .then(res=> {
              json['src']=res.path;
              return json;
            });
}