import { Injectable, Type } from '@angular/core';
import { DynamicControl } from '../dynamic-forms-page/models/dynamic-forms.model';
import { DynamicInputComponent } from './dynamic-input.component';
import { DynamicSelectComponent } from './dynamic-select.component';

type DynamicControlMap = {
  [T in DynamicControl['controlType']]: Type<any>;
};

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {
  private controlComponents: DynamicControlMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent
  }

  resolve(controlType: keyof DynamicControlMap) {
    return this.controlComponents[controlType];
  }
}