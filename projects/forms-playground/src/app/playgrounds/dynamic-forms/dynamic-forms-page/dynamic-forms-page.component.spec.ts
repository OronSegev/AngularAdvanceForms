import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormsPageComponent } from './dynamic-forms-page.component';

describe('DynamicFormsPageComponent', () => {
  let component: DynamicFormsPageComponent;
  let fixture: ComponentFixture<DynamicFormsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicFormsPageComponent]
    });
    fixture = TestBed.createComponent(DynamicFormsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
