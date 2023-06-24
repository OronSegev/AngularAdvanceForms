import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../core/user-info';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../common-page.scss',
    '../common-form.scss',
    './template-forms-page.component.scss',
]
})
export class TemplateFormsPageComponent {

  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    yearOfBirth: 0,
    passport: '',
    fullAddress: '',
    city: '',
    postCode: ''
  }

  constructor() { }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  ngOnInit(): void {
  }
}
