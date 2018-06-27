import getJson from "./RabCmp";
import { load as loadHtml } from 'cheerio'

export default function(data) {
  let json = getJson(data);
  json['isRichText'] = true;
  json['text'] = getText(data.content);
  json.style['height'] = 'auto';
  json.style['font-family'] = '黑体';
	let reg = /font-family:[^\:]*?\;/;
	json['text'] = json['text'].replace(reg, '');
  return Promise.resolve(json);
}


function getText(text) {
	let reg = /([^>]*)/;
	let ss = '';
	if(reg.test(text)) {
	  ss = text.match(reg)[1];
  }
	let $ = loadHtml(text);
	if($('div').length == 1) {
		if(ss) {
			let reg1 = /style="([^"]*)/;
			if(reg1.test(ss)) {
			  	let mm = ss.match(reg1)[1];
			  	let ss1 = ss.replace(mm, mm + ';padding:7px 15px;');
			  	ss = text.replace(ss, ss1);
			} else {
				let append = ' style="padding:7px 15px;"'
				ss = text.replace(ss, ss + append);
			}
		} else {
			ss = '<div style="padding:7px 15px;">' + text +'</div>';
		}	
	} else {
		ss = '<div style="padding:7px 15px;">' + text +'</div>';
	}

	ss = ss.replace(/秀秀/g,'我们');
	ss = ss.replace(/中网易企秀/g,'XXX');
	ss = ss.replace(/易企秀/g,'兔展');
	ss = ss.replace(/www.eqxiu.com/, 'www.rabbit.com');
	
	return ss;
}