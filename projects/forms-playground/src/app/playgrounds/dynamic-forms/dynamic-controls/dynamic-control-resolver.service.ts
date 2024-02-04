import { Injectable, Type } from '@angular/core';
import { DynamicControl } from '../dynamic-forms-page/models/dynamic-forms.model';
import { DynamicInputComponent } from './dynamic-input.component';
import { DynamicSelectComponent } from './dynamic-select.component';
import { DynamicCheckboxComponent } from './dynamic-checkbox.component';
import { DynamicGroupComponent } from './dynamic-group.component';

type DynamicControlMap = {
  [T in DynamicControl['controlType']]: Type<any>;
};

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {
  private controlComponents: DynamicControlMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent,
    checkbox: DynamicCheckboxComponent,
    group: DynamicGroupComponent
  }

  resolve(controlType: keyof DynamicControlMap) {
    return this.controlComponents[controlType];
  }
}
