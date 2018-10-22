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

  if (url == 'http://as.eqh5.com/c/images/wx_default-454286.png') {
    json['src'] = '//mic.rabbitpre.com/file/a1eb232e-65a6-4ac3-b823-6750451e2dea';
    return Promise.resolve(json);
  }

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