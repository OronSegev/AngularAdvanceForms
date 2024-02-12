import { ComponentRef, DestroyRef, Directive, ElementRef, Input, OnDestroy, OnInit, ViewContainerRef, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl, NgForm, NgModel } from '@angular/forms';
import { EMPTY, Subject, fromEvent, iif, merge, skip, startWith, takeUntil } from 'rxjs';
import { InputErrorComponent } from './input-error/input-error.component';
import { ErrorStateMatcher } from './input-error/error-state-matcher.service';

@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {
  @Input() errorStateMatcher = inject(ErrorStateMatcher);

  ngControl = inject(NgControl, { self: true});
  elementRef = inject(ElementRef)

  private viewContainerRef = inject(ViewContainerRef);
  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private destroy = new Subject();
  private parentControlContainer = inject(ControlContainer, {optional: true});

  get form() {
    return this.parentControlContainer?.formDirective as NgForm | FormGroupDirective | null;
  }

  ngOnInit(): void {
    if(!this.ngControl.control) throw Error(`No control model for ${this.ngControl.name} control ...`);

    merge(
      this.ngControl.control?.statusChanges,
      fromEvent(this.elementRef.nativeElement, 'blur'),
      iif(() => !!this.form, this.form!.ngSubmit, EMPTY)
    ).pipe(
      takeUntil(this.destroy),
      startWith(this.ngControl.control.status),
      skip(this.ngControl instanceof NgModel ? 1 : 0)
    ).subscribe(() => {
      if (this.errorStateMatcher.isErrorVisible(this.ngControl.control, this.form)){
        this.componentRef ??= this.viewContainerRef.createComponent(InputErrorComponent);
        this.componentRef.changeDetectorRef.markForCheck();
        this.componentRef.setInput('errors', this.ngControl.errors);
      } else {
        this.componentRef?.destroy();
        this.componentRef = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
