import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicControl, dynamicControlProvider } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    dynamicControlProvider
  ],
  template: `
    <label [for]="control.controlKey">{{ control.config.label }}</label>
    <input [formControlName]="control.controlKey" [value]="control.config.value" [id]="control.controlKey" [type]="control.config.type"/>
  `,
  styles: []
})
export class DynamicInputComponent extends BaseDynamicControl {}
