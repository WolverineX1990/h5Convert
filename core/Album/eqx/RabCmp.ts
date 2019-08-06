import exqCmpTypes from './../../enum/eqxCmp';
import aniType from './../../const/EQXANI'
import { parseTransform } from './../../utils'

export default getJson;

function getJson(json) {
  let newJson = {
    id: randomId(),
    text: '',
		style: getStyle(json.css, json.type),
		trigger: [],
		triggers: [], 
		animations: getAnis(json.properties),
    visible: true,
    type: exqCmpTypes[json.type],
    cmpIndex: json.cmpIndex
  }
  
  return newJson;
}

function randomId() {
  return Math.ceil(Math.random() * 10000000000);
}

function getAnis(json) {
  let animations = [];
  if(!json || !json.anim) {
    return animations;
  }

  let anims = json.anim;
  for (var i = 0; i <anims.length; i++) {
    if(aniType[anims[i].type]) {
      if(!anims[i].direction) {
        anims[i].direction = 0;
      }
      let animObj = aniType[anims[i].type][anims[i].direction];
      if(animObj && animObj.rabbit) {
        let count = anims[i].count == 1 ? 'Infinity' : anims[i].countNum;
        let anim = {
          animate: animObj.rabbit,
          count: count,
          delay: anims[i].delay,
          duration: anims[i].duration || 1,
          isActive: true,
          interval: 0,
          isCompose: false,
          name: animObj.rabbit,
          order: 'normal'
        };
        //打字机动画
        if (anim.animate == 'typewriter') {
          anim.isCompose = true;
        }
        animations.push(anim);
      } else {
        console.log('id:' + json.id + '-anim:'+aniType[anims[i].type].name+'direction-'+anims[i].direction+'not found!');	
      }
    } else {
      if(anims[i].type != -1) {
        console.log('id:' + json.id + '-anim-type-direction'+anims[i].type+'-'+anims[i].direction+'not found!');
      }
    }
  }
  return animations;
}

function getStyle(css, type) {
  if(!css) {
    return {};
  }
  let style = {
		height: css.height,
		width: css.width,
		top: css.top,
		left: css.left,
		rotate: css.rotate,
		transform: css.transform,
		opacity: css.opacity,
		color: css.color
  };

  if(css.lineHeight && type!=2) {
		style['lineHeight'] = css.lineHeight;
	}
  
  if(css.textAlign) {
		style['text-align'] = css.textAlign;
	}

	if(css.backgroundColor) {
		style['background-color'] = css.backgroundColor;
	}

	if(css.borderRadius) {
		style['border-radius'] = css.borderRadius;
  }
  
  if(css.transform) {
		var rotate = parseTransform(css.transform).rotate;
		style.rotate = rotate;
		style.transform = getRotateStr(rotate);
  }
  
  if(css.borderStyle && css.borderWidth && css.borderColor) {
		style['border-style'] = css.borderStyle;
		style['border-color'] = css.borderColor;
    style['border-width'] = css.borderWidth;
    // console.log(style)
	}

	if(css.fontSize) {
		style['fontSize'] = css.fontSize;
  }
  
  return style;
}

function getRotateStr(rotate) {
  if (rotate !== undefined) {
      return `rotate(${rotate}deg)`
  }
  return '';
}