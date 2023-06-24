import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../common-page.scss',
    '../common-form.scss',
    './template-forms-page.component.scss',
]
})
export class TemplateFormsPageComponent {
  constructor() { }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  ngOnInit(): void {
  }
}
