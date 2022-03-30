import {
  cloneDeep,
  filter,
  find,
  times,
  isPlainObject,
  isArray,
  isEqual,
} from "lodash";
import { Tag } from "carbon-components-svelte";
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

  checkItemExist(m) {
    if (m.id) {
      return this.items.find((item) => isEqual(get(item).id, get(m).id));
    }
    return this.items.find((item) => isEqual(get(item).cid, get(m).cid));
  }

  handleItemExist(exist, i) {
    if (exist) {
      let index = this.findIndex(exist);
      this.items[index] = i;
    } else {
      this.items.push(i);
    }
  }

  createModel(item) {
    if (!item.id) {
      item.cid = this.cidCount;
      this.cidCount += 1;
    }
    let model = new Item(item);
    let exist = this.checkItemExist(model);
    this.handleItemExist(exist, model);
  }

  addItem(i) {
    if (isPlainObject(i)) {
      this.createModel(i);
    } else if (i.isModel) {
      let exist = this.checkItemExist(i);
      this.handleItemExist(exist, i);
    }
  }

  add(items) {
    if (isArray(items)) {
      items.forEach((item) => {
        this.addItem(item);
      });
    } else {
      this.addItem(items);
    }
    this._notify();
  }

  removeItem(item) {
    if (this.checkItemExist(item)) {
      let index = this.findIndex(item);
      this.items.splice(index, 1);
    }
  }

  remove(i) {
    if (isArray(i)) {
      i.forEach((item) => {
        this.removeItem(item);
      });
    } else {
      this.removeItem(i);
    }
    this._notify();
  }

  reset() {
    this.items = [];
    this._notify();
  }

  filter(a) {
    let keys = Object.keys(a);
    return this.items.filter((item) => {
      let count = 0;
      keys.forEach((k) => {
        if (item.attrs[k] === a[k]) {
          count += 1;
        }
      });
      if (count === keys.length) {
        return item;
      }
    });
  }

  find(a) {
    let keys = Object.keys(a);
    return this.items.find((item) => {
      let count = 0;
      keys.forEach((k) => {
        if (item.attrs[k] === a[k]) {
          count += 1;
        }
      });
      if (count === keys.length) {
        return item;
      }
    });
  }

  findIndex(m) {
    return this.items.findIndex((item) => isEqual(get(item), get(m)));
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
