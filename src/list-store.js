import {
  cloneDeep,
  filter,
  find,
  times,
  isPlainObject,
  isArray,
  _,
} from "lodash";
import { Tag } from "carbon-components-svelte";
import { Model, Collection } from "./store";
import { get } from "svelte/store";
// const _ = require("lodash");

export class Item extends Model {
  constructor(attrs) {
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

  createModel(item) {
    let model = new Model(item);
    let isExist = this.checkItemExist();
    if (isExist) {
      // TODO
    }
    return model;
  }

  checkItemExist(m) {
    // TODO how to check with model instance
    return _.result(_.find(this.items, { id: m.id }), "id");
  }

  addItem(i) {
    if (_.isPlainObject(i)) {
      return this.createModel(i);
    } else if (i instanceof Model) {
      let isExist = this.checkItemExist(i);
      if (!isExist) return i;
    }
  }

  add(i) {
    let newItems = [];
    if (_.isArray(i)) {
      i.forEach((_item) => {
        newItems = [...newItems, this.addItem(_item)];
      });
    } else {
      newItems = [...newItems, this.addItem(i)];
    }

    this.items = this.items.concat(newItems);
    this._notify();
  }

  remove(i) {
    if (_.isArray(i)) {
      let items = _.remove(array, function (n) {
        return !_.result(_.find(i, { id: m.id }), "id");
      });
      this.items = items;
    } else {
    }
    // if(Array.isArray(myArray))
  }

  reset() {
    this.items = [];
  }

  filter(id) {
    return this.items.filter((item) => item.id === id);
  }

  find(id) {
    return this.items.find((item) => item.id === id);
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
