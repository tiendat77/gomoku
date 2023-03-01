import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export class PasswordValidators {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if the control value is empty return no error.
        return <any>null;
      }

      // test the value of the control against the regexp supplied.
      const valid = regex.test(control.value);

      // if true, return no error, otherwise return the error object passed in the second parameter.
      return valid ? <any>null : error;
    };
  }

  static noWhiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if the control value is empty return no error.
        return <any>null;
      }

      // test the value of the control against the regexp supplied.
      const valid = !String(control.value ?? '').includes(' ');


      // if true, return no error, otherwise return the error object passed in the second parameter.
      return valid ? <any>null : {whitespaces: true};
    };
  }

}


