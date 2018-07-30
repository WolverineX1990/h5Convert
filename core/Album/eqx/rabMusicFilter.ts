import getJson from "./RabCmp";

export default function(data) {
  let json = getJson(data);
  json['autoPlay'] = true;
  json['musicBucket'] = data.musicBucket,
	json['musicKey'] = data.musicKey,
  json['musicName'] = data.musicName,
  json['musicServer'] = data.musicServer,
  json['musickId'] = data.musickId,
  json['switchOn'] = true,
  json['src'] = data.src,
  json['loopPlay'] = true;
  json.type = 'bgmusic';
  json.style = {
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: 0,
    height: 30,
    left: 276,
    opacity: 1,
    rotate: 0,
    top: 14,
    width:30
  };
  return json;
}