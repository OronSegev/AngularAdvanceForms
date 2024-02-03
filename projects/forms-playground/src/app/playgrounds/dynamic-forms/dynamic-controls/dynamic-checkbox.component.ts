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
    </ng-container>
  `,
  styles: [
  ]
})
export class DynamicCheckboxComponent extends BaseDynamicControl {}
