import { Directive, HostBinding, StaticProvider, inject } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { CONTROL_DATA } from "../control-data.token";


export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => {
    const parentContainer = inject(ControlContainer, { skipSelf: true});
    return parentContainer;
  }
}

@Directive()
export class BaseDynamicControl {
  @HostBinding('class') hostClass = 'form-field'
  control = inject(CONTROL_DATA);
  private parentFormGroup = inject(ControlContainer);

  get formGroup() {
    return this.parentFormGroup.control as FormGroup;
  }
}
