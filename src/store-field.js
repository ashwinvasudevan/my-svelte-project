import { writable, get } from "svelte/store";

export default function createFieldStore(field, initialValue = null) {
  initialValue === null && (initialValue = field.default);

  const store = writable({
    value: initialValue,
    error: null,
    dirty: false,
    validators: [],
    ...field,
  });

  const { subscribe, set, update } = store;

  async function validate() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let { value, validators, required } = get(store);
    let error = null;

    if (value == null) {
      if (required) {
        error = {
          message: "This field is required",
        };
      }
    } else {
      for (let validator of validators) {
        let message = await validator(value);
        if (message) {
          error = {
            message,
          };
          break;
        }
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
    initialValue = value;
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
    set($s) {
      let value = $s.value;
      console.log("set", value);
      $s.dirty = value === initialValue;
      set({ ...$s });
    },
  };
}
