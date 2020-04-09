export default class ListenersHolder {
    constructor() {
        this._listeners = [];

        this.addListener = this.addListener.bind(this);
        this.removeAllListeners = this.removeAllListeners.bind(this);
    }

    addListener(el, name, listener) {
        el.addEventListener(name, listener);
        this._listeners.push({el, name, listener});
    }

    removeAllListeners() {
        this._listeners.forEach(({name, listener, el}) => el.removeEventListener(name, listener));
    }
}

