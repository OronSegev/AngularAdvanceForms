import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, config, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  DynamicControl,
  DynamicFormConfig,
} from './models/dynamic-forms.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { banWords } from '../../reactive-forms/validators/ban-words';
import { DynamicControlResolver } from '../dynamic-controls/dynamic-control-resolver.service';
import { ControlInjectorPipe } from "../control-injector.pipe";

@Component({
    selector: 'app-dynamic-forms-page',
    standalone: true,
    templateUrl: './dynamic-forms-page.component.html',
    styleUrls: ['../../common-page.scss', './dynamic-forms-page.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe]
})
export class DynamicFormsPageComponent implements OnInit {
  form!: FormGroup;

  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected fromConfig$!: Observable<DynamicFormConfig>;

  constructor(private http: HttpClient, public controlResolver: DynamicControlResolver) {}

  ngOnInit(): void {
    this.fromConfig$ = this.formLoadingTrigger.pipe(
      switchMap((config) =>
        this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)
      ),
      tap(({ controls }) => {
        this.buildForm(controls);
      })
    );
  }

  protected onSumbit() {
    console.log(this.form.value);
    this.form.reset();
  }

  private buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({});
    Object.keys(controls).forEach((key) => this.buildControls(key, controls[key], this.form));
  }

  private buildControls(controlKey: string, config: DynamicControl, formGroup: FormGroup){
    if (config.controlType === 'group') {
      this.buildGroup(controlKey, config.controls, formGroup);
      return;
    }
    const validators = this.resolveValidators(config);
    formGroup.addControl(controlKey, new FormControl(config.value, validators));
  }

  buildGroup(controlKey: string, controls: DynamicControl['controls'], parentFormGroup: FormGroup<any>) {
    if(!controls) return;
    const nestedFormGroup = new FormGroup({});
    Object.keys(controls).forEach((key) => this.buildControls(key, controls[key], nestedFormGroup));
    parentFormGroup.addControl(controlKey, nestedFormGroup);
  }

  private resolveValidators({ validators = {} }: DynamicControl) {
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
