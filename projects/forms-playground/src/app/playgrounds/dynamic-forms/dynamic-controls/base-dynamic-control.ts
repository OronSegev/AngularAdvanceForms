import { Directive, HostBinding, OnInit, StaticProvider, inject } from "@angular/core";
import { AbstractControl, ControlContainer, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CONTROL_DATA } from "../control-data.token";
import { CommonModule, KeyValue } from "@angular/common";
import { DynamicControl } from "../dynamic-forms-page/models/dynamic-forms.model";
import { banWords } from "../../reactive-forms/validators/ban-words";
import { DynamicValidatorMessageDirective } from "../../../core/dynamic-validator-message.directive";

export const comparatorFn = (a: KeyValue<string, DynamicControl>, b: KeyValue<string, DynamicControl>): number => a.value.order - b.value.order

export const sharedDynamicControlsDeps = [CommonModule, ReactiveFormsModule, DynamicValidatorMessageDirective]

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => {
    const parentContainer = inject(ControlContainer, { skipSelf: true});
    return parentContainer;
  }
}

@Directive()
export class BaseDynamicControl implements OnInit{
  @HostBinding('class') hostClass = 'form-field'

  control = inject(CONTROL_DATA);
  formControl: AbstractControl = new FormControl(
    this.control.config.value,
    this.resolveValidators(this.control.config)
  );

  private parentFormGroup = inject(ControlContainer);

  get formGroup() {
    return this.parentFormGroup.control as FormGroup;
  }

  ngOnInit(): void {
    (this.parentFormGroup.control as FormGroup).addControl(this.control.controlKey, this.formControl);
  }

  protected resolveValidators({ validators = {} }: DynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map((validatorKey) => {
      const validatorValue = validators[validatorKey];

      if (validatorKey === 'required') {
        return Validators.required;
      }
      if (validatorKey === 'email') {
        return Validators.email;
      }
      if (validatorKey === 'requiredTrue') {
        return Validators.requiredTrue;
      }
      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      if (validatorKey === 'banWords' && Array.isArray(validatorValue)) {
        return banWords(validatorValue);
      }
      return Validators.nullValidator;
    });
  }
}
