import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input({ required: true}) label = '';

  @Input() value: string | null = '';


}
