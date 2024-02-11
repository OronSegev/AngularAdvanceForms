import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlsDeps } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [...sharedDynamicControlsDeps],
  viewProviders: [dynamicControlProvider],
  template: `
    <label [for]="control.controlKey">{{ control.config.label }}</label>
    <input [formControlName]="control.controlKey" [value]="control.config.value" [id]="control.controlKey" [type]="control.config.type"/>
  `,
  styles: []
})
export class DynamicInputComponent extends BaseDynamicControl {}
