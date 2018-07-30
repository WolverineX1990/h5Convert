import { post } from 'needle';

function upload(url, data) {
  let promise = new Promise((resolve, reject) => {
    post(url, data, {multipart: true}, function(err, resp, body) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });

  return promise;
}

function noloop() {}

function needlePost(url, data) {
  return upload(url, data)
            .then(noloop, ()=>upload(url, data))
            .then(noloop, ()=>upload(url, data));
}

export default needlePost;