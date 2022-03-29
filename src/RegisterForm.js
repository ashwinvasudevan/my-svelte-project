import FormBase from "./store.js";

import { min, verifyEmail } from "./validators";

export default class RegisterForm extends FormBase {

  static fields = {
    email: {
      type: "email",
      validators: [verifyEmail],
    },
    password: {
      type: "password",
      validators: [min(4)],
    },
  };

  getFieldDefs() {
    return { ...RegisterForm.fields, id: FormBase.id };
  }
}
