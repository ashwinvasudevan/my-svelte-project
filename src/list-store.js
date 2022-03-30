import { cloneDeep, isPlainObject, isArray } from "lodash";
import { Model, Collection } from "./store";
import { get } from "svelte/store";

export class Item extends Model {
  constructor(attrs) {
    super();
    this.attrs = attrs;
  }

  get id() {
    return this.attrs.id;
  }

  clone() {
    let clonedAttrs = cloneDeep(this.attrs);
    let constructor = this.constructor;
    return new constructor(clonedAttrs);
  }

  reset(parsed) {
    this.attrs = parsed;
  }

  toJSON() {
    return cloneDeep(this.attrs);
  }

  getStoreValue() {
    return this.attrs;
  }
}

export class ListStore extends Collection {
  constructor(items = []) {
    super();
    this.items = this.parseItems(items);
    this.cidCount = 1;
  }

  getUrlRoot() {
    throw new Error("Not implemented");
  }

  async fetch() {
    throw new Error("Not implemented");
  }

  parseItems(items) {
    return items.map((item) => {
      this.parseItem(item);
    });
  }

  parseItem(item) {
    return new Model(item);
  }

  getStoreValue() {
    return this.items;
  }

  checkItemExist(model) {
    if (model.id) {
      return this.items.find((item) => get(item).id === get(model).id);
    }
    return this.items.find((item) => get(item).cid === get(model).cid);
  }

  createModel(item) {
    if (!item.id) {
      item.cid = `c${this.cidCount}`;
      this.cidCount += 1;
    }
    let model = new Item(item);
    return model;
  }

  exists(model) {
    // Returns true / false
    if (model.id) {
      return this.items.find((item) => get(item).id === get(model).id);
    }
    return this.items.find((item) => get(item).cid === get(model).cid);
  }

  replace(model, index) {
    // accept model and accept an index, and replace.
    this.items[index] = model;
  }

  addItem(item) {
    let model = item;

    if (isPlainObject(item)) {
      model = this.createModel(item);
    }

    let exist = this.exists(model);
    if (exist) {
      let index = this.findIndex(exist);
      this.replace(model, index);
    } else {
      this.items.push(model);
    }
    this._notify();
  }

  add(items) {
    if (isArray(items)) {
      items.forEach((item) => {
        this.addItem(item);
      });
    } else {
      this.addItem(items);
    }
  }

  removeItem(item) {
    if (this.checkItemExist(item)) {
      let index = this.findIndex(item);
      this.items.splice(index, 1);
    }
  }

  remove(items) {
    // supports for ID, model and arr of models.
    if (isArray(items)) {
      items.forEach((item) => {
        this.removeItem(item);
      });
    } else if (items.isModel) {
      this.removeItem(item);
    } else {
      let model = this.find({ id: items });
      this.removeItem(model);
    }
    this._notify();
  }

  reset() {
    this.items = [];
    this._notify();
  }

  filter(attrs) {
    let keys = Object.keys(attrs);
    return this.items.filter((item) => {
      let values = keys.map((key) => attrs[key] === item.attrs[key]);
      return values.every((bool) => bool === true);
    });
  }

  find(attrs) {
    let keys = Object.keys(attrs);
    return this.items.find((item) => {
      let values = keys.map((key) => attrs[key] === item.attrs[key]);
      return values.every((bool) => bool === true);
    });
  }

  findIndex(model) {
    // Should be based on ID, CID,
    return this.items.findIndex(
      (item) =>
        get(item).id === get(model).id && get(item).cid === get(model).cid
    );
  }

  // add(MODEL || ARR OF MODELS || plain JSON || arr of plain JSON){

  //   // Does not make backend ops unless save is called
  //   // Note that adding the same model (a model with the same id) to a collection more than once
  //   // is a no-op.

  // }

  // remove(MODEL || ARR OF MODELS ){

  // }

  // reset(EMPTY THE Collection || replace all colls || array of plan json or models to replace with) {

  // }

  // UNCOMMENT
  // get length() {
  //   return this.items.length;
  // }

  // filter(attrs) {

  // }

  // find(attrs) {

  // }
}

// 2. Filtering
// 3. Sorting

// 2. Paginated List Store
// 3.
