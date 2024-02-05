import { Injectable, Type } from '@angular/core';
import { DynamicControl } from '../dynamic-forms-page/models/dynamic-forms.model';
import { DynamicInputComponent } from './dynamic-input.component';
import { DynamicSelectComponent } from './dynamic-select.component';
import { DynamicCheckboxComponent } from './dynamic-checkbox.component';
import { DynamicGroupComponent } from './dynamic-group.component';
import { from, of, tap } from 'rxjs';

type DynamicControlMap = {
  [T in DynamicControl['controlType']]: () => Promise<Type<any>>;
};

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {
  private lazyControlComponents: DynamicControlMap = {
    input: () => import('./dynamic-input.component').then(c => c.DynamicInputComponent),
    select: () => import('./dynamic-select.component').then(c => c.DynamicSelectComponent),
    checkbox: () => import('./dynamic-checkbox.component').then(c => c.DynamicCheckboxComponent),
    group: () => import('./dynamic-group.component').then(c => c.DynamicGroupComponent)
  }
  private loadedControlComponents = new Map<string, Type<any>>();

  resolve(controlType: keyof DynamicControlMap) {
    const loadedComponent = this.loadedControlComponents.get(controlType);
    if (loadedComponent) return of(loadedComponent);

    return from(this.lazyControlComponents[controlType]()).pipe(tap(comp => this.loadedControlComponents.set(controlType, comp)));
  }
}
