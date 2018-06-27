import getJson from "./RabCmp";
import CONFIG from "../../const/CONFIG";
import Rabbit from "../Rabbit";
import imagePool from './imagePool';

export default function(data, rabbit: Rabbit) {
  let json = getJson(data);
  var url = data.properties.src;
  var reg = /^http/;
  if(!reg.test(url)) {
    url = CONFIG.eqxReSHOST + url;
  }
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