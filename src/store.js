import { writable, get } from "svelte/store";
import EventEmitter from "./EventEmitter";
import createFieldStore from "./store-field";

class SvelteStore extends EventEmitter {
  constructor() {
    super();
    this._listeners = [];
  }

  _notify() {
    for (let listener of this._listeners) {
      listener(this.value);
    }
  }

  // making models a svelte store
  subscribe(listener) {
    this._listeners.push(listener);
    listener(this.value);
    return () => {
      this._listeners.splice(this._listeners.indexOf(listener), 1);
    };
  }
}

export default class FormBase extends SvelteStore {
  static id = {
    type: "uuid ",
  };

  constructor() {
    super();
    this.state = writable("default");
    this.syncState = writable(false);
    this.syncError = writable(null);
    let fields =  this.getFieldDefs(); 
    this.value = Object.keys(fields).reduce((memo, key) => {
      memo[key] = createFieldStore(fields[key]);
      return memo;
    }, {});

  }

  getID() {
    return this.value.id.value;
  }

  getUrl() {
    return this.getRootUrl + "/" + this.getID();
  }

  getRootUrl() {
    throw new Error("Not implemented");
  }

  isNew() {
    return !this.getID();
  }

  async submit(e) {
    e.preventDefault();
    this.state.set("active");

    let errors = [];

    for (let key in this.value) {
      let field = this.value[key];
      await field.validate();
      errors.push(get(field).error);
    }

    let hasError = errors.some((error) => error != null);
    if (hasError) {
      this.state.set("default");
    } else {
      await this.save();
      this.state.set("finished");
    }
  }

  async fetch() {
    this.syncState.set(true);
    try {
      let res = await GET(this.getUrl());
      let parsed = this.parse(res);
      let fields = this.getFieldDefs();

      Object.keys(fields).forEach((key) => {
        this.value[key].reset(parsed[key]);
      });
    } catch (e) {
      this.syncError.set(e);
      throw e;
    } finally {
      this.syncState.set(false);
    }
  }

  async parse(res) {
    return res;
  }

  async save() {
    // TODO MAKE SURE TO SET ALL VALUES FROM SERVER AFTER SAVE IS CALLED
    this.syncState.set(true);
    try {
      if (this.isNew()) {
        await POST(this.getRootUrl(), this.toJSON());
      } else {
        await PATCH(this.getUrl(), this.toJSON(true));
      }
    } catch (e) {
      this.syncError.set(e);
      throw e;
    } finally {
      this.syncState.set(false);
    }
  }

  async delete() {
    await DELETE(this.getUrl());
  }

  toJSON(dirty = false) {
    return Object.keys(this.value).reduce((memo, key) => {
      let field = this.value[key];

      if (!dirty || field.isDirty()) {
        memo[key] = this.value[key].value;
      }

      return memo;
    }, {});
  }

  getFieldDefs() {
    throw new Error("Not implemented");
  }

  getState() {
    return this.state;
  }
}



