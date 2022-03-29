import FormBase from "./store.js";

import { min, verifyEmail } from "./validators";

export default class RegisterForm extends FormBase {
  static fields = {
    email: {
      type: "email",
      validators: [verifyEmail],
      required: false,
      default: ''
    },
    password: {
      type: "password",
      validators: [min(4)],
      required: true,
      default: ''
    },
  };

  getFieldDefs() {
    return { ...RegisterForm.fields, id: FormBase.id };
  }
}
