import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

export interface ErrorStateMatcher {
  isErrorVisible(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorStateMatcher implements ErrorStateMatcher {
  isErrorVisible(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return Boolean(control && control.invalid && (control.dirty || control.touched || (form && form.submitted)));
  }
}


export class OntouchedErrorStateMatcher implements ErrorStateMatcher {
  isErrorVisible(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return Boolean(control && control.invalid && (control.touched || (form && form.submitted)));
  }
}

export class OnDirtyErrorStateMatcher implements ErrorStateMatcher {
  isErrorVisible(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return Boolean(control && control.invalid && (control.dirty || (form && form.submitted)));
  }
}
