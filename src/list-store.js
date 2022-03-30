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
    return this.items.find((item) => isEqual(get(item), get(m)));
  }

  handleItemExist(isExist, m) {
    if (isExist) {
      throw new Error("Already exists");
    } else {
      return m;
    }
  }

  createModel(item) {
    let model = new Item(item);
    let isExist = this.checkItemExist(model);
    return this.handleItemExist(isExist, model);
  }

  addItem(i) {
    if (isPlainObject(i)) {
      return this.createModel(i);
    } else if (i.isModel) {
      let isExist = this.checkItemExist(i);
      return this.handleItemExist(isExist, i);
    }
  }

  add(i) {
    let newItems = [];
    try {
      if (isArray(i)) {
        i.forEach((_item) => {
          newItems = [...newItems, this.addItem(_item)];
        });
      } else {
        newItems = [...newItems, this.addItem(i)];
      }
    } catch (e) {
      console.log(e);
    }

    this.items = this.items.concat(newItems);
    this._notify();
  }

  removeItem(item) {
    if (item.isModel && this.checkItemExist(item)) {
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
    let fArr = [];
    let keys = Object.keys(a);
    this.items.forEach((item) => {
      let count = 0;
      keys.forEach((k) => {
        if (item.attrs[k] === a[k]) {
          count += 1;
        }
      });
      if (count === keys.length) {
        fArr.push(item);
      }
    });
    return fArr;
  }

  find(a) {
    let fValue;
    let keys = Object.keys(a);
    for (let item of this.items) {
      let count = 0;
      keys.forEach((k) => {
        if (item.attrs[k] === a[k]) {
          count += 1;
        }
      });
      if (count === keys.length) {
        fValue = item;
        break;
      }
    }
    return fValue;
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
