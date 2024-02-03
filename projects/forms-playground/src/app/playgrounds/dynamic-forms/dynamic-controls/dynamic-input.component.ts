import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONTROL_DATA } from '../control-data.token';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule],
  template: `
        <input
          [value]="control.config.value"
          [id]="control.controlKey"
          [type]="control.config.type"
        />
  `,
  styles: [
  ]
})
export class DynamicInputComponent {

  control = inject(CONTROL_DATA);

}
