import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormControlsComponent } from './custom-form-controls.component';

describe('CustomFormControlsComponent', () => {
  let component: CustomFormControlsComponent;
  let fixture: ComponentFixture<CustomFormControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomFormControlsComponent]
    });
    fixture = TestBed.createComponent(CustomFormControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
