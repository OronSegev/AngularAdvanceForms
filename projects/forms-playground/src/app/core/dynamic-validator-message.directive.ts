import { ComponentRef, DestroyRef, Directive, OnDestroy, OnInit, ViewContainerRef, inject } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import { Subject, skip, startWith, takeUntil } from 'rxjs';
import { InputErrorComponent } from './input-error/input-error.component';

@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {
  ngControl = inject(NgControl, { self: true});

  private viewContainerRef = inject(ViewContainerRef);
  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private destroy = new Subject();

  ngOnInit(): void {
    this.ngControl.control?.statusChanges.pipe(
      takeUntil(this.destroy),
      startWith(this.ngControl.control.status),
      skip(this.ngControl instanceof NgModel ? 1 : 0)
    ).subscribe(() => {
      if (this.ngControl.errors){
        this.componentRef ??= this.viewContainerRef.createComponent(InputErrorComponent);
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
