import {
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {} from '@angular/compiler';
import '@polymer/paper-input/paper-textarea';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditableContentValueAccessor } from '../value-accessor/editable-content.directive';
import { RatingOption, RatingPickerComponent } from 'customFormControls';

interface Rating {
  reviewText: string;
  reviewRating: RatingOption;
}

@Component({
  selector: 'app-rating-picker-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditableContentValueAccessor,
    RatingPickerComponent,
  ],
  templateUrl: './rating-picker-page.component.html',
  styleUrls: ['../../common-page.scss', './rating-picker-page.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingPickerPageComponent {
  form = this.fb.group<Rating>({
    reviewText: '',
    reviewRating: 'great',
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.form.value);
    this.form.reset();
  }

  handleInput(e: Event) {}
}
