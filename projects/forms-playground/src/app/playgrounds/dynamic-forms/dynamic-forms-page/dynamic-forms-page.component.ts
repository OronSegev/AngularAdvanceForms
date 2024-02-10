import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DynamicFormConfig } from './models/dynamic-forms.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicControlResolver } from '../dynamic-controls/dynamic-control-resolver.service';
import { ControlInjectorPipe } from "../control-injector.pipe";
import { comparatorFn } from '../dynamic-controls/base-dynamic-control';
import { InputErrorComponent } from '../../../core/input-error/input-error.component';
import { ERROR_MESSAGE, VALIDATION_ERROR_MESSAGES } from '../../../core/input-error/validation-error-messages.token';

@Component({
    selector: 'app-dynamic-forms-page',
    standalone: true,
    templateUrl: './dynamic-forms-page.component.html',
    styleUrls: ['../../common-page.scss', './dynamic-forms-page.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe, InputErrorComponent],
    providers: [
      {
        provide: VALIDATION_ERROR_MESSAGES,
        useValue: {...ERROR_MESSAGE, required: `Don't leave this field empty`}
      }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsPageComponent implements OnInit {

  protected coparatorFn = comparatorFn;

  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected fromConfig$!: Observable<{form: FormGroup, config: DynamicFormConfig}>;

  constructor(private http: HttpClient, public controlResolver: DynamicControlResolver) {}

  ngOnInit(): void {
    this.fromConfig$ = this.formLoadingTrigger.pipe(
      switchMap((config) =>
        this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)
      ),
      map(config =>({
        config,
        form: new FormGroup({})
      }))
    );
  }

  protected onSumbit(form: FormGroup) {
    console.log(form.value);
    form.reset();
  }
}
