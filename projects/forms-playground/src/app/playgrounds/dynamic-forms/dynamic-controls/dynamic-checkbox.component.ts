import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicControl } from './base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <input type="checkbox" [formControlName]="control.controlKey" [id]="control.controlKey" [checked]="control.config.value">
      <label [for]="control.controlKey">{{ control.config.label }}</label>
    </ng-container>
  `,
  styles: [
    `:host {
      display: flex;
      align-items: center;
      margin-top: 10px
    }`
  ]
})
export class DynamicCheckboxComponent extends BaseDynamicControl {}
