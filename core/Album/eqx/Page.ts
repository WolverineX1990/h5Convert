import exqCmpTypes from './../../enum/eqxCmp';
import Rabbit from '../Rabbit';
import rabImgFilter from './rabImgFilter';
import rabTextFilter from './rabTextFilter';
import rabInputFilter from './rabInputFilter';
import rabOnecallFilter from './rabOnecallFilter';
import rabShapeFilter from './rabShapeFilter';
import rabSubmitFilter from './rabSubmitFilter';
import rabMapFilter from './rabMapFilter';
import rabPraiseFilter from './rabPraiseFilter';
import rabSelectFilter from './rabSelectFilter';
import rabMusicFilter from './rabMusicFilter';
import rabBgFilter from './rabBgFilter';
import rabRichTextFilter from './rabRichTextFilter';
import rabLinkFilter from './rabLinkFilter';
import rabCommentFilter from './rabCommentFilter';
import rabWxHeadFilter from './rabWxHeadFilter';

export default class Page {
  data: Object;
  private _filters: Object = {};
  constructor(data) {
    this.data = data;
    this.addFilter(exqCmpTypes.image, rabImgFilter);  
    this.addFilter(exqCmpTypes["image-1"], rabBgFilter);
    this.addFilter(exqCmpTypes["text-1"], rabLinkFilter);
    this.addFilter(exqCmpTypes["text-2"], rabTextFilter);
    this.addFilter(exqCmpTypes.wxnickname, rabTextFilter);
    this.addFilter(exqCmpTypes.text, rabRichTextFilter);
    this.addFilter(exqCmpTypes.input, rabInputFilter);
    this.addFilter(exqCmpTypes["input-"], rabInputFilter);
    this.addFilter(exqCmpTypes["input-email"], rabInputFilter);
    this.addFilter(exqCmpTypes["input-name"], rabInputFilter);
    this.addFilter(exqCmpTypes["input-tel"], rabInputFilter);
    this.addFilter(exqCmpTypes.onecall, rabOnecallFilter);
    this.addFilter(exqCmpTypes.shape, rabShapeFilter);
    this.addFilter(exqCmpTypes.submit, rabSubmitFilter);
    this.addFilter(exqCmpTypes["submit-"], rabSubmitFilter);
    this.addFilter(exqCmpTypes.map, rabMapFilter);
    this.addFilter(exqCmpTypes.praise, rabPraiseFilter);
    this.addFilter(exqCmpTypes.select, rabSelectFilter);
    this.addFilter(exqCmpTypes.comment, rabCommentFilter);
    this.addFilter(exqCmpTypes.wxportrait, rabWxHeadFilter);
  }

  private addFilter(type, filter) {
    this._filters[type] = filter;
  }

  getRabJson(rabbit: Rabbit, row: number) {
    let rabbitData = rabbit.data;
    let json = {
      appId: rabbitData['id'],
      id: `page_${row + 1}`,
      formatVersion: '2.0',
      height: 504,
      width: 320,
      row,
      col: 0,
      in: null,
      out: null,
      bgColor: '#fff',
      bgImage: null,
      bgServer: '',
      bgImageType: 0,
      bgLeft: 0,
      bgTop: 0,
      cmps: []
    };

    let elements = this.data['elements'].sort((a, b)=>{
      let aIndex = a.css.zIndex;
      let bIndex = b.css.zIndex;
      return aIndex - bIndex;
    });

    if(rabbitData['bgmusic'] && row === 0) {
      json.cmps[elements.length] = rabMusicFilter(rabbitData['bgmusic']);
    }

    let promises = [];
    for(let i = 0;i<elements.length;i++) {
      let obj = elements[i];
      if(obj.type == exqCmpTypes["image-1"] && obj.properties.bgColor) {
        json['bgColor'] = obj.properties.bgColor;
        elements.splice(i, 1);
        i--;
        continue;
      }
      obj.cmpIndex = i;
      let filter = this._filters[obj.type];
      if(filter) {
        promises.push(filter(obj, rabbit).then(res=>{
          return json.cmps[res.cmpIndex] = res;
        }))
      } else {
        console.log(`page: ${row} cmps: ${i} ${obj.type} not fond filter`);
      }
    }

    return Promise.all(promises).then(()=>json);
  }
}