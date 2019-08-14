import { getHtml, getPageData } from './../utils/index';
import { getViewData } from './../api/service';
import Rabbit from './Rabbit';
import CONFIG from './../const/CONFIG';
import Page from './eqx/Page';
import * as crypto from 'crypto';

/**
 * @description 易企秀场景对象
 * @author wolverinex
 * @class Scene
 */
export default class Scene {
  dataUrl: string;
  data: Object;
  pages: Array<any>;
  constructor(url: string) {
    this.dataUrl = url;
  }

  loadData(): Promise<Scene> {
    let cookie;
    return getHtml(this.dataUrl).then(res => {
      cookie = res['cookie'] || [];
      return loadSuc(res['data']);
    }).then(res => {
      res = (res + '').replace(/:,/g, ':"",');
      this.data = eval("("+res+")");
      return getViewData(this.data['id'], this.data['code'], this.data['publishTime'], cookie.join('; '));
    }).then(json => {
      const obj = json.obj;
      let str = null;
      let str3 = null;
      let iv = null;
      try {
        let str1 = obj.substring(0, 19);
        let str2 = obj.substring(19 + 16);
        str3 = obj.substring(19, 19 + 16);
        iv = str3;
        str = str1 + str2;
        let cipherChunks = [];
        let decipher = crypto.createDecipheriv('aes-128-cfb', str3, iv);
        decipher.setAutoPadding(false);
        cipherChunks.push(decipher.update(str, 'base64', 'utf8'));
        this.pages  = JSON.parse(cipherChunks.join(''));

      } catch(err) {
        str = obj.substring(0, obj.length - 16);
        str3 = obj.substring(obj.length - 16);
        iv = str3;
        let cipherChunks = [];
        let decipher = crypto.createDecipheriv('aes-128-cfb', str3, iv);
        decipher.setAutoPadding(false);
        cipherChunks.push(decipher.update(str, 'base64', 'utf8'));
        this.pages  = JSON.parse(cipherChunks.join(''));
      }

      if(!json['success']) {
        throw new Error('Class:Scene->method:getViewData fail');
      }
      
      return this;
    });
  }

  toRabbit(rabbit: Rabbit) {
    rabbit.data['name'] = this.data['name'] + '-复制';
    rabbit.data['desc'] = this.data['description'];
    if(this.data['pageMode'] == 6) {
			rabbit.data['in'] = 'cvbe';
		} else {
			rabbit.data['in'] = 'move';
    }
    
    return rabbit.setBgAudio(getBgAudio(this.data))
              .then(() => insertRabbitPages(rabbit, this.pages, this.data['pageMode']))
              .then(() => filterEmpty(rabbit.data['pages']))
              .then(() => rabbit.save())
              .then(res => {
                if(!res.success) {
                  console.log(res);
                }
                return setRabMeta(rabbit, this.data)
              });
  }
}

function loadSuc(data: string){
  let dataReg: RegExp = /var[\s|\w]*scene[\s|\w]*=[\s|\w]*{([\s|\w|\W]+);/;
  return getPageData(data, dataReg);
}

function insertRabbitPages(rabbit: Rabbit, pages: Array<Object>, pageMode: string) {
  let rabPages = rabbit.data['pages'];
  rabPages[0].deleted = true;
  let promises = [];
  for(let i = 0;i<pages.length;i++) {
    promises.push(new Page(pages[i])
                  .getRabJson(rabbit, i)
                  .then(res => rabPages[res.row + 1] = res));
  }
  return Promise.all(promises);
}

function getBgAudio(data: Object): string {
  let audio;
  if(data['bgAudio'] && data['bgAudio'].url) {
    audio = data['bgAudio'].url;
    let reg = /^http/;
    if(!reg.test(audio)) {
      audio = CONFIG.eqxReSHOST + audio;
    }
  }

  return audio;
}

function filterEmpty(pages) {
  pages.forEach(page => {
    page.cmps = page.cmps.filter(comp => !!comp);
  });

  return pages;
}

function setRabMeta(rabbit: Rabbit, eqxMeta) {
  rabbit.data['gather'] = JSON.stringify(rabbit.data['gather']);
  var cover = eqxMeta.cover;
	var reg = /^http/;
	//默认logo
	if(cover && cover!='group2/M00/7F/9B/yq0KXlZNGfWAbZo_AAAdI0Feqt0138.png') {
		if(!reg.test(cover)) {
			cover = CONFIG.eqxReSHOST + cover;
		}
    return rabbit.setCover(cover)
              .then(() => rabbit.publish())
              .then(() => rabbit.saveApp());
  } else {
    return rabbit.publish();
  }
}