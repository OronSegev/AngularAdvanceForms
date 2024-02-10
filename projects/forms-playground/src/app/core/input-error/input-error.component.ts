import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-messages.token';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let error of errors | keyvalue" class="input-error">
      {{ errorsMap[error.key] }}
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class InputErrorComponent {
  @Input() errors!: ValidationErrors | undefined | null = null;

  protected errorsMap = inject(VALIDATION_ERROR_MESSAGES);
}
