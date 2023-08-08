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
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  inject,
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type SelectedValue<T> = T | null;

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
export class SelectComponent<T> implements AfterContentInit {
  @Input({ required: true }) label = '';

  @Input() displayWith:((value: T) => string | number ) | null = null;

  @Input()
  set value(value: SelectedValue<T>) {
    this.selectionModel.clear();
    if (value) {
      this.selectionModel.select(value);
    }
  }
  get value() {
    return this.selectionModel.selected[0] || null;
  }

  @Output() readonly selectionChanged = new EventEmitter<SelectedValue<T>>();
  @Output() readonly opened = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>();

  @HostListener('click') open() {
    this.isOpen = true;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  isOpen = false;

  private selectionModel = new SelectionModel<T>();
  private destroyRef = inject(DestroyRef);

  protected get displayValue() {
    if (this.displayWith && this.value) {
      return this.displayWith(this.value);
    }

    return this.value;
  }

  ngAfterContentInit(): void {
    this.handleSelectionModelChanged();
    this.handleOptionsChanged();
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
          this.findOptionsByValue(rv)?.deselect();
        });
        values.added.forEach((av) =>
          this.findOptionsByValue(av)?.highlightAsSelected()
        );
      });
  }

  private handleOptionsChanged() {
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => {
          queueMicrotask(() => {
            this.highlightSelectedOptions(this.value);
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
    this.close();
  }

  private highlightSelectedOptions(value: SelectedValue<T>) {
    this.findOptionsByValue(value)?.highlightAsSelected();
  }

  private findOptionsByValue(value: SelectedValue<T>) {
    return (
      this.options && this.options.find((option) => option.value === value)
    );
  }
}
