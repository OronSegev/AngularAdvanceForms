import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfo } from '../../core/user-info';
import {
  BanWordsDirective,
  PasswordShouldMatchDirective,
  UniqeNicknameDirective,
} from './validators/index';
import { DynamicValidatorMessageDirective } from '../../core/dynamic-validator-message.directive';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanWordsDirective,
    PasswordShouldMatchDirective,
    UniqeNicknameDirective,
    DynamicValidatorMessageDirective
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../common-page.scss',
    '../common-form.scss',
    './template-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateFormsPageComponent implements AfterViewInit {
  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    yearOfBirth: 2022,
    passport: '',
    address: {
      fullAddress: '',
      city: '',
      postCode: '',
    },
    password: '',
    confirmPassword: '',
  };
  @ViewChild(NgForm)
  formDir!: NgForm;

  private intialFormValue: unknown;

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.intialFormValue = this.formDir.value;
    });
  }

  get isAdult() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.userInfo.yearOfBirth >= 18;
  }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40))
      .fill('')
      .map((_, idx) => now - idx);
  }

  onSubmitForm(form: NgForm) {
    if(this.formDir.invalid) return;
    console.log('the form has submited, ', form.value);
    // reset form
    this.formDir.resetForm(this.formDir.value)
    this.intialFormValue = this.formDir.value;
    // this.formDir.resetForm();
  }

  onReset(e: Event) {
    e.preventDefault();
    this.formDir.resetForm(this.intialFormValue);
  }
}
