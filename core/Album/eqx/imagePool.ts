import { EventEmitter } from "events";

enum imgState {
  loaded= 1,
  loading = 2
};

class Pool {
  private _imgs = {};
  private _imgKeys = {};
  private _emitter: EventEmitter;
  constructor() {
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(100);
  }

  hasImgKey(key: string) {
    return this._imgKeys[key];
  }

  getImg(key: string) {
    if (this._imgKeys[key] = imgState.loading) {
      let _emitter = this._emitter;
      return new Promise((resolve) => {
        let callback = function(url) {
          _emitter.removeListener(key, callback);
          resolve(url);
        }
        _emitter.on(key, callback);
      });
    } else {
      return Promise.resolve(this._imgs[key]);
    }
  }

  pushImgKey(key: string) {
    this._imgKeys[key] = imgState.loading;
  }

  loadedImg(key: string, url: string) {
    this._imgKeys[key] = imgState.loaded;
    this._imgs[key] = url;
    this._emitter.emit(key, url);
  }
}

let pool = new Pool();

export default pool;