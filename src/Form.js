import { writable, get } from "svelte/store";
import createFieldStore from "./store-field";

import { min, verifyEmail } from "./validators";

let fields = {
  email: {
    type: "email",
    validators: [verifyEmail],
  },
  password: {
    type: "password",
    validators: [min(4)],
  },
};

export default function createFormStore() {
  let state = writable("default");

  let form = Object.keys(fields).reduce((memo, key) => {
    memo[key] = createFieldStore(fields[key]);
    return memo;
  }, {});

  const store = writable(form);

  async function submit(e) {
    e.preventDefault();
    state.set("active");

    let errors = [];

    for (let key in form) {
      let field = form[key];
      await field.validate();
      errors.push(get(field).error);
    }

    let bool = errors.some((error) => error != null);
    if (bool) {
      state.set("default");
    } else {
      state.set("finished");
      // await save()
    }
  }

  function toJSON() {
    return Object.keys(fields).reduce((memo, key) => {
      memo[key] = fields[key].value;
      return memo;
    }, {});
  }

  function clone() {}

  async function fetch() {}

  async function save() {
    // Called if bool in submit is false
    // At this point, no fields have errors
    // Should form be a single call to backend or multiple calls?
    // -  Should be a single call, handle in DB if you want to store in multiple tables
    // - and such
    // For forms, is "isDirty" and field level granularity really necessary?
    // We can just pass in the whole form and call save everytime.
  }

  function getState() {
    return state;
  }

  const { subscribe, set, update } = store;

  async function validateCustom() {}

  return {
    getState,
    subscribe,
    update,
    submit,
    validateCustom,
    reset: () => set(0),
  };
}

