import { getHtml, getPageData } from './../utils/index';
import { getViewData } from './../api/service';
import Rabbit from './Rabbit';
import CONFIG from './../const/CONFIG';
import Page from './eqx/Page';

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
    return getHtml(this.dataUrl).then(res => loadSuc(res))
              .then(res => {
                this.data = eval("("+res+")");
                return getViewData(this.data['id'], this.data['code'], this.data['publishTime']);
              })
              .then(json => {
                if(!json['success']) {
                  throw new Error('Class:Scene->method:getViewData fail');
                }
                this.pages = json['list'];
                return this;
              });
  }

  toRabbit(rabbit: Rabbit) {
    rabbit.data['name'] = this.data['name'];
    rabbit.data['desc'] = this.data['description'];
    if(this.data['pageMode'] == 6) {
			rabbit.data['in'] = 'cvbe';
		} else {
			rabbit.data['in'] = 'move';
    }
    
    return rabbit.setBgAudio(getBgAudio(this.data))
              .then(() => insertRabbitPages(rabbit, this.pages, this.data['pageMode']))
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
							.then(() => rabbit.publish());
  } else {
    return rabbit.publish();
  }
}