export default class EventEmitter {
  constructor() {
    this._eventTarget = new EventTarget();
  }

  dispatch(name) {
    this._eventTarget.dispatchEvent(new Event(name));
  }

  subscribe(name, cb) {
    this._eventTarget.addEventListener(name, cb);
    const unsubscribe = () => {
      this._eventTarget.removeEventListener(name, cb);
    };

    return unsubscribe;
  }
}
