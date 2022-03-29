export default class EventEmitter {
    __ee_listeners;
    constructor() {
        this.__ee_listeners = {};
    }
    emit(name, ...args) {
        (this.__ee_listeners[name] || []).forEach(l => l(...args));
    }
    off(name, listener) {
        let listeners = this.__ee_listeners[name];
        if (listeners == void 0) {
            listeners = this.__ee_listeners[name] = [];
        }
        let index = listeners.indexOf(listener);
        while (index >= 0) {
            listeners.splice(index, 1);
            index = listeners.indexOf(listener);
        }
        return this;
    }
    on(name, listener) {
        let listeners = this.__ee_listeners[name];
        if (listeners == void 0) {
            listeners = this.__ee_listeners[name] = [];
        }
        listeners.push(listener);
        return this;
    }
    once(name, listener) {
        const l2 = (...args) => {
            this.off(name, l2);
            listener(...args);
        };
        this.on(name, l2);
        return this;
    }
    reset() {
        this.__ee_listeners = [];
    }
    waitForEvent(name, ...selectors) {
        return new Promise(resolve => {
            const l2 = (...args) => {
                for (let i = 0, length = selectors.length; i < length; i += 1) {
                    if (selectors[i] !== args[i]) {
                        return;
                    }
                }
                resolve(args[0]);
            };
            this.on(name, l2);
        });
    }
}
