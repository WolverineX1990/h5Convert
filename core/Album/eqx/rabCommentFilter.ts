import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
  json['boardTmpPos'] = {
    left: 0,
    top: 0,
    width: 318,
    height: 320
  };

  json['btnTmpPos'] = {
    height: 32,
    width: 120,
    top: 171,
    left: 35
  };

  json['label'] = '写留言';
  json['commentMode'] = 'barrage';
  json['autoplayBarrage'] = true;
  json['content'] = '';
  json['defaultComments'] = [];
  return Promise.resolve(json);
}