let FormData = require('form-data');
import fetch from 'node-fetch';

function upload(url, data) {
  let form = new FormData();
  Object.keys(data).forEach(key => {
    if (key == 'file') {
      form.append(key, Buffer.from(data[key], 'binary'));
    } else {
      form.append(key, data[key]);
    }
  });

  return fetch(url, { method: 'POST', body: form })
}

function noloop(res) {
  // console.log('ttt', res);
  // return res.json();
}

function uploadExt(url, data) {
  return upload(url, data)
                // .then(noloop, (err)=> console.log(err))
            .then(noloop, ()=>upload(url, data))
            .then(noloop, ()=>upload(url, data));
}

export default uploadExt;