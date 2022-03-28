import { writable, get } from "svelte/store";

export default function createFieldStore(field) {
  const store = writable({
    value: "",
    error: null,
    ...field,
  });

  const { subscribe, set, update } = store;

  async function validate() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let { value, error } = get(store);
    if (!value.includes("@")) {
      error = {
        message: "Invalid Email",
      };
    } else {
      error = null;
    }
    update((s) => ({
      ...s,
      error,
    }));
  }

  return {
    subscribe,
    update,
    validate,
    reset: () => set(0),
  };
}
