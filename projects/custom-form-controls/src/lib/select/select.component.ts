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
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActiveDescendantKeyManager} from '@angular/cdk/a11y'

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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> implements OnInit, OnChanges, AfterContentInit, ControlValueAccessor {
  @Input({ required: true }) label = '';
  @Input() searchable = false;
  @HostBinding('class.disabled')
  @Input() disabled = false;
  @Input() displayWith: ((value: T) => string | number) | null = null;
  @Input() compareyWith: (v1: T | null, v2: T | null) => boolean = (v1, v2) => v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
    this.setupValue(value);
    this.onChange(value);
    this.highlightSelectedOptions();
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
  @Output() readonly searchChanged = new EventEmitter<string>();

  @HostListener('blur') markAsTouched() {
    if (this.disabled && !this.isOpen) {
      this.onTouched();
      this.cd.markForCheck();
    };
  }


  @HostListener('click') open() {
    if (this.disabled) return;
    this.isOpen = true;
    if (this.searchable) {
      setTimeout(() => {
        this.searchInputEl.nativeElement.focus();
      }, 0);
    }
    this.cd.markForCheck();
  }

  @HostListener('keydown', ['$event']) protected onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' && !this.isOpen) {
      this.open();
      return;
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      this.listKeyManager.onKeydown(e);
      return;
    }
    if (e.key === 'Enter' && this.isOpen && this.listKeyManager.activeItem) {
      this.handleSelection(this.listKeyManager.activeItem);
    }
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  @ViewChild('input') searchInputEl!: ElementRef<HTMLInputElement>;

  @HostBinding('class.select-panel-open')
  isOpen = false;

  private setupValue(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      if (Array.isArray(value)) {
        this.selectionModel.select(...value);
      } else {
        this.selectionModel.select(value);
      }
    }
  }

  private selectionModel = new SelectionModel<T>(
    coerceBooleanProperty(this.multiple)
  );

  protected get displayValue() {
    if (this.displayWith && this.value) {
      if(Array.isArray(this.value)) {
        return this.value.map(this.displayWith);
      }

      return this.displayWith(this.value);
    }

    return this.value;
  }
  protected onChange: (newValue: SelectValue<T>) => void = () => {};
  protected onTouched: () => void = () => {};

  private optionMap = new Map< SelectValue<T> | T | null, OptionComponent<T>>();
  private destroyRef = inject(DestroyRef);
  private listKeyManager!: ActiveDescendantKeyManager<OptionComponent<T>>;

  constructor(@Attribute('multiple') private multiple: string | null, private cd: ChangeDetectorRef, private hostEl: ElementRef) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.listKeyManager = new ActiveDescendantKeyManager(this.options).withWrap();
    this.listKeyManager.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(itemIndex=> {
      // scroll the element into view
      this.options.get(itemIndex)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });
    this.handleSelectionModelChanged();
    this.handleOptionsChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOptions();
    }
  }

  writeValue(value: SelectValue<T>): void {
    this.setupValue(value);
    this.highlightSelectedOptions();
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  clearSelection(event?: Event) {
    event?.stopPropagation();
    if (this.disabled) return;
    this.selectionModel.clear();
    this.selectionChanged.emit(this.value);
    this.onChange(this.value);
    this.cd.markForCheck();
  }

  close() {
    if (this.disabled) return;
    this.isOpen = false;
    this.onTouched();
    this.hostEl.nativeElement.focus();
    this.cd.markForCheck();
  }

  protected onHandleInput(event: Event) {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }

  protected onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
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
    if (this.disabled) return
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
      this.onChange(this.value);
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
