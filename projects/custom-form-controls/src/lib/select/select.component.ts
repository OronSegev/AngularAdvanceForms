import {
  AnimationEvent,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  inject,
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type SelectValue<T> = T | T[] | null;

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      transition(':enter', [animate('220ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [
        animate('320ms cubic-bezier(0.88, -0.7, 0.86, 0.85)'),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> implements OnChanges, AfterContentInit {
  @Input({ required: true }) label = '';

  @Input() displayWith: ((value: T) => string | number) | null = null;
  @Input() compareyWith: (v1: T | null, v2: T | null) => boolean = (v1, v2) =>
    v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      if (Array.isArray(value)) {
        this.selectionModel.select(...value);
      } else {
        this.selectionModel.select(value);
      }
    }
  }
  get value() {
    if (this.selectionModel.isEmpty()) {
      return null;
    }
    if (this.selectionModel.isMultipleSelection()) {
      return this.selectionModel.selected;
    }
    return this.selectionModel.selected[0];
  }

  @Output() readonly selectionChanged = new EventEmitter<SelectValue<T>>();
  @Output() readonly opened = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>();

  @HostListener('click') open() {
    this.isOpen = true;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  isOpen = false;

  private selectionModel = new SelectionModel<T>(
    coerceBooleanProperty(this.multiple)
  );
  private optionMap = new Map< SelectValue<T> | T | null, OptionComponent<T>>();
  private destroyRef = inject(DestroyRef);

  protected get displayValue() {
    if (this.displayWith && this.value) {
      if(Array.isArray(this.value)) {
        return this.value.map(this.displayWith);
      }

      return this.displayWith(this.value);
    }

    return this.value;
  }

  constructor(@Attribute('multiple') private multiple: string | null) {}

  ngAfterContentInit(): void {
    this.handleSelectionModelChanged();
    this.handleOptionsChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOptions();
    }
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.selectionModel.clear();
    this.selectionChanged.emit(this.value);
  }

  close() {
    this.isOpen = false;
  }

  onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }

    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  private handleSelectionModelChanged() {
    this.selectionModel.changed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        values.removed.forEach((rv) => {
          this.optionMap.get(rv)?.deselect();
        });
        values.added.forEach((av) =>
          this.optionMap.get(av)?.highlightAsSelected()
        );
      });
  }

  private handleOptionsChanged() {
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => this.refreshOptionsMap()),
        tap(() => {
          queueMicrotask(() => {
            this.highlightSelectedOptions();
          });
        }),
        switchMap((options) => merge(...options.map((o) => o.selected))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((selectedOption) => this.handleSelection(selectedOption));
  }

  private handleSelection(option: OptionComponent<T>) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }
    if(!this.selectionModel.isMultipleSelection()) {
      this.close();
    }
  }

  private highlightSelectedOptions() {
    const valuesWithUpdatedreferences = this.selectionModel.selected.map(
      (value) => {
        const correspondingOption = this.findOptionsByValue(value);
        return correspondingOption ? correspondingOption.value! : value;
      }
    );
    this.selectionModel.clear();
    this.selectionModel.select(...valuesWithUpdatedreferences);
  }

  private findOptionsByValue(value: T | null) {
    if (this.optionMap.has(value)) {
      return this.optionMap.get(value);
    }

    return (
      this.options &&
      this.options.find((option) => this.compareyWith(option.value, value))
    );
  }

  private refreshOptionsMap() {
    this.optionMap.clear();
    this.options.forEach((o) => this.optionMap.set(o.value, o));
  }
}
