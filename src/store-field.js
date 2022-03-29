import { writable, get } from "svelte/store";

export default function createFieldStore(field) {
  const store = writable({
    value: "",
    error: null,
    dirty: false,
    validators: [],
    ...field,
  });

  const { subscribe, set, update } = store;

  async function validate() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let { value, validators } = get(store);

    let error = null;

    for (let validator of validators) {
      let message = await validator(value);
      if (message) {
        error = {
          message,
        };
        break;
      }
    }

    update((s) => ({
      ...s,
      error,
    }));
  }

  function reset(value) {
    update((s) => ({
      ...s,
      dirty: false,
      value,
    }));
  }

  return {
    subscribe,
    update,
    validate,
    reset,
    get value() {
      return get(store).value;
    },
    set value(_value) {
      update((s) => (s.value = _value), s);
    },
    set,
  };
}
