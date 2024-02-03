import { inject } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { CONTROL_DATA } from "../control-data.token";


export class BaseDynamicControl {
  control = inject(CONTROL_DATA);
  private parentFormGroup = inject(ControlContainer);

  get formGroup() {
    return this.parentFormGroup.control as FormGroup;
  }
}
