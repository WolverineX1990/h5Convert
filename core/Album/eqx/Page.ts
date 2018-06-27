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

export default class Page {
  data: Object;
  private _filters: Object = {};
  constructor(data) {
    this.data = data;
    this.addFilter(exqCmpTypes.image, rabImgFilter);
    this.addFilter(exqCmpTypes["image-1"], rabBgFilter);
    this.addFilter(exqCmpTypes.text1, rabTextFilter);
    this.addFilter(exqCmpTypes.text, rabRichTextFilter);
    this.addFilter(exqCmpTypes.ginput, rabInputFilter);
    this.addFilter(exqCmpTypes["ginput-"], rabInputFilter);
    this.addFilter(exqCmpTypes["ginput-email"], rabInputFilter);
    this.addFilter(exqCmpTypes["ginput-name"], rabInputFilter);
    this.addFilter(exqCmpTypes["ginput-tel"], rabInputFilter);
    this.addFilter(exqCmpTypes.onecall, rabOnecallFilter);
    this.addFilter(exqCmpTypes.shape, rabShapeFilter);
    this.addFilter(exqCmpTypes.gsubmit, rabSubmitFilter);
    this.addFilter(exqCmpTypes["gsubmit-"], rabSubmitFilter);
    this.addFilter(exqCmpTypes.map, rabMapFilter);
    this.addFilter(exqCmpTypes.praise, rabPraiseFilter);
    this.addFilter(exqCmpTypes.gselect, rabSelectFilter);
  }

  private addFilter(type, filter) {
    this._filters[type] = filter;
  }

  getRabJson(rabbit: Rabbit, row: number) {
    let rabbitData = rabbit.data;
    let json = {
      appId: rabbitData['id'],
      row,
      col: 0,
      in: null,
      out: null,
      bgCol: '#fff',
      bgImage: null,
      bgServer: null,
      bgLeft: 0,
      bgTop: 0,
      cmps: []
    };

    if(rabbitData['bgmusic']) {
      json.cmps.push(rabMusicFilter(rabbitData['bgmusic']));
    }

    var elements = this.data['elements'].sort((a, b)=>{
      var aIndex = a.css.zIndex;
      var bIndex = b.css.zIndex;
      return aIndex - bIndex;
    });

    let promises = [];
    for(var i = 0;i<elements.length;i++) {
      let obj = elements[i];
      if(obj.type == exqCmpTypes["image-1"] && obj.properties.bgColor) {
        json['bgcol'] = obj.properties.bgColor;
        continue;
      }
      let filter = this._filters[obj.type];
      if(filter) {
        promises.push(filter(obj, rabbit).then(res=>json.cmps.push(res)))
      } else {
        console.log(`${obj.type} not fond filter`);
      }
    }

    return Promise.all(promises).then(()=>json);
  }
}