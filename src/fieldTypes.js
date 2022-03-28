// import { min } from "./validators";

// class Base {
//   constructor(type, validators = []) {
//     this.type = type;
//     this.validators = validators;
//   }

//   async validate(value) {
//     for (let validator of this.validators) {
//       validator.validate(value);
//       return;
//     }
//   }
// }

// class Email extends Base {}

// async function customValidator(value) {}

// class Password extends Base {
//   constructor(minLength = 4) {
//     super("password", [min(minLength)]);
//   }
// }
