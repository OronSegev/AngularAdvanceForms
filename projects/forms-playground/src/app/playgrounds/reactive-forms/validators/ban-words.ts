import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function banwords(bannedWords: string[] = []): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const foundBannedWord = bannedWords.find(
      (word) => word.toLowerCase() === control.value?.toLowerCase()
    );
    return !foundBannedWord
      ? null
      : { banWords: { bannedWords: foundBannedWord } };
  };
}
