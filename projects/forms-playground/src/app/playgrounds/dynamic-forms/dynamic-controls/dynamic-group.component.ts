import { Component, HostBinding, inject } from '@angular/core';
import { BaseDynamicControl, comparatorFn, dynamicControlProvider, sharedDynamicControlsDeps } from './base-dynamic-control';
import { FormGroup } from '@angular/forms';
import { ControlInjectorPipe } from "../control-injector.pipe";
import { DynamicControlResolver } from './dynamic-control-resolver.service';

@Component({
    selector: 'app-dynamic-group',
    standalone: true,
    imports: [...sharedDynamicControlsDeps, ControlInjectorPipe],
    viewProviders: [dynamicControlProvider],
    template: `
      <fieldset [formGroupName]="control.controlKey">
        <legend>{{ control.config.label }}</legend>
        <ng-container class="form-field" *ngFor="let control of control.config.controls | keyvalue">
          <ng-container
          [ngComponentOutlet]="controlResolver.resolve(control.value.controlType) | async"
          [ngComponentOutletInjector]="control.key | controlInjector:control.value"></ng-container>
        </ng-container>
      </fieldset>
    `,
    styles: []
  })
export class DynamicGroupComponent extends BaseDynamicControl {
  @HostBinding('class') override hostClass = 'form-field-group'
  controlResolver = inject(DynamicControlResolver);
  override formControl = new FormGroup({}, this.resolveValidators(this.control.config));
  protected comparatorFn = comparatorFn;
}
