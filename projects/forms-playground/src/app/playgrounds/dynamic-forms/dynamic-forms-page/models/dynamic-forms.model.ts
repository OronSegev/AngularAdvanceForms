import { ValidatorFn, Validators } from "@angular/forms";

export interface DynamicOptions {
  label: string;
  value: string;
}

type CustomValidators = { banWords: ValidatorFn }
type validatorKeys = keyof Omit<typeof Validators & CustomValidators, 'prototype' | 'compose' | 'composeAsync'>

export interface DynamicControl<T = string> {
  controlType: 'input' | 'select' | 'checkbox' | 'group';
  type?: string;
  label: string;
  value: T | null;
  order: number,
  options?: DynamicOptions[];
  controls?: DynamicFormConfig['controls'],
  validators?: {
    [key in validatorKeys]?: unknown;
  }
}

export interface DynamicFormConfig {
  description: string;
  controls: {
    [key:string] : DynamicControl
  }
}
