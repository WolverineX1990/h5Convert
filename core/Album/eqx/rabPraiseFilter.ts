import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
  json['content'] = {
    icon: 'diao',
    img: '',
    num: 0,
    state: 'icon'
  };
  json['layout'] = 'landscape';
  json.style['height'] = 'auto';
  json.type = 'praise';
  return Promise.resolve(json);
}