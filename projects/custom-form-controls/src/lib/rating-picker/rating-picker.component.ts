import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type RatingOption = 'great' | 'good' | 'neutral' | 'bad' | null;

@Component({
  selector: 'lib-rating-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-picker.component.html',
  styleUrls: ['./rating-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RatingPickerComponent,
      multi: true,
    },
  ],
})
export class RatingPickerComponent implements OnChanges, ControlValueAccessor {
  @Input() value: RatingOption = null;

  @Output() change = new EventEmitter<RatingOption>();

  @Input()
  @HostBinding('attr.tabIndex')
  tabIndex = 0;

  @Input() disabled = false;

  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  onChange: (newvalue: RatingOption) => void = () => {};
  onTouch!: () => void;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.onChange(changes['value'].currentValue);
    }
  }

  setValue(value: RatingOption) {
    if (!this.disabled) {
      this.value = value;
      this.onChange(this.value);
      this.onTouch();
      this.change.emit(this.value);
    }
  }

  writeValue(obj: RatingOption): void {
    this.value = obj;
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }
}
