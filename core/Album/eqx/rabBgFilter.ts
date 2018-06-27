import getJson from "./RabCmp";
import CONFIG from "../../const/CONFIG";
import Rabbit from "../Rabbit";
import imagePool from './imagePool';

export default function(data, rabbit: Rabbit) {
  let json = getJson(data);
  var url = data.properties.imgSrc;
  var reg = /^http/;
  if(!reg.test(url)) {
    url = CONFIG.eqxReSHOST + url;
  }
  json.style['left'] = -14;
  json.style['top'] = -9;
  json.style['width'] = 348;
  json.style['height'] = 524;
  let types = json.type.split('-');
  json.type = types[0];;
  json['crop'] = json['display'] = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: json.style['width'],
    height: json.style['height']
  };

  json['fullSize'] = {
    width: json.style['width'],
    height: json.style['height']
  };
  if(imagePool.hasImgKey(url)) {
    return imagePool.getImg(url)
              .then(res => {
                json['src']=res;
                return json;
              })
  } else {
    imagePool.pushImgKey(url);
    return rabbit.uploadImg(url)
            .then(res=> {
              json['src']=res.path;
              imagePool.loadedImg(url, res.path);
              return json;
            });
  }
}