import { writable, get } from "svelte/store";
import EventEmitter from "./EventEmitter";
import createFieldStore from "./store-field";

export class SvelteStore extends EventEmitter {
  constructor() {
    super();
    this._listeners = [];
  }

  _notify() {
    for (let listener of this._listeners) {
      listener(this.getStoreValue());
    }
  }

  // making models a svelte store
  subscribe(listener) {
    this._listeners.push(listener);
    listener(this.getStoreValue());
    return () => {
      this._listeners.splice(this._listeners.indexOf(listener), 1);
    };
  }

  getStoreValue() {
    return this;
    throw new Error("Not implemented");
  }

  clone() {
    throw new Error("Not implemented!");
  }
}

export class SyncableStore extends SvelteStore {
  constructor() {
    super();
    this.syncState = writable(false);
    this.syncError = writable(null);
  }

  getUrlRoot() {
    throw new Error("Not implemented");
  }

  async fetch() {
    throw new Error("Not implemented");
  }
}

export class Model extends SyncableStore {
  constructor() {
    super();
    this._isModel = true;
  }

  isNew() {
    return !this.id;
  } 

  get isModel() {
    return this._isModel;
  }

  set isModel(val) {
    this._isModel = val;
  }

  get id() {
    throw new Error("Not implemented!");
  }

  getUrl() {
    return this.getUrlRoot() + "/" + this.id;
  }

  async fetch() {
    this.syncState.set(true);
    try {
      let res = await GET(this.getUrl());
      let parsed = this.parse(res);
      this.reset(parsed);
    } catch (e) {
      this.syncError.set(e);
      throw e;
    } finally {
      this.syncState.set(false);
    }
  }

  reset(parsed) {
    throw new Error("Reset not implemented");
  }

  parse(res) {
    return res;
  }

  toJSON() {
    throw new Error("toJSON not implemented");
  }

  async save() {
    // TODO MAKE SURE TO SET ALL VALUES FROM SERVER AFTER SAVE IS CALLED
    this.syncState.set(true);
    try {
      if (this.isNew()) {
        await POST(this.getUrlRoot(), this.toJSON());
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
}
export class Collection extends SyncableStore {}

export class FormBase extends Model {
  static id = {
    type: "uuid ",
  };

  constructor() {
    super();
    this.state = writable("F");
    let fields = this.getFieldDefs();
    this.value = Object.keys(fields).reduce((memo, key) => {
      memo[key] = createFieldStore(fields[key]);
      return memo;
    }, {});
  }

  getStoreValue() {
    return this.value;
  }

  get id() {
    return this.value.id.value;
  }

  getUrl() {
    return this.getUrlRoot() + "/" + this.id;
  }

  getUrlRoot() {
    throw new Error("Not implemented");
  }

  reset(parsed) {
    let fields = this.getFieldDefs();
    Object.keys(fields).forEach((key) => {
      this.value[key].reset(parsed[key]);
    });
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
