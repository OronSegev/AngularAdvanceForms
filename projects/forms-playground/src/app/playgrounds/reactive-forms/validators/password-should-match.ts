import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordShouldmatch(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value === confirmPassword?.value) {
    return null;
  }

  const error = { passwordShouldmatch: { mismatch: true } };

  confirmPassword?.setErrors(error)

  return error;
}
