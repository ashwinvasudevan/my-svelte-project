import { writable, get } from "svelte/store";
import createFieldStore from "./store-field";

export default function createFormStore(form) {
  function updateKey(key, value) {
    update((o) => ((o[key] = value), o));
  }

  form.fields = form.fields.map(createFieldStore);

  const store = writable({
    state: "default",
    ...form,
  });

  async function submit(e) {
    e.preventDefault();
    updateKey("state", "active");

    for (let field of form.fields) {
      await field.validate();
    }

    let errors = form.fields.map((field) => get(field).error);
    let bool = errors.some((error) => error != null);

    if (bool) {
      updateKey("state", "default");
    } else {
      updateKey("state", "finished");
    }
  }

  const { subscribe, set, update } = store;

  async function validate() {}

  return {
    subscribe,
    update,
    validate,
    submit,
    reset: () => set(0),
  };
}
