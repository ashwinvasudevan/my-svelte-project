import { cloneDeep, filter, find, times } from "lodash";
import { Tag } from "carbon-components-svelte";
import { Model, Collection } from "./store";

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

  add(MODEL || ARR OF MODELS || plain JSON || arr of plain JSON){

    // Does not make backend ops unless save is called
    // Note that adding the same model (a model with the same id) to a collection more than once
    // is a no-op.

  }

  remove(MODEL || ARR OF MODELS ){

  }

  reset(EMPTY THE Collection || replace all colls || array of plan json or models to replace with) {

  }

  get length() {
    return this.items.length;
  }

  filter(attrs) {

  }

  find(attrs) {

  }
}

2. Filtering 
3. Sorting

2. Paginated List Store
3. 