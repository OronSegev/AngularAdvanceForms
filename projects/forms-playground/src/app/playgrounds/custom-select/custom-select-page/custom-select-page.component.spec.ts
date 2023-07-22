import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectPageComponent } from './custom-select-page.component';

describe('CustomSelectPageComponent', () => {
  let component: CustomSelectPageComponent;
  let fixture: ComponentFixture<CustomSelectPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomSelectPageComponent]
    });
    fixture = TestBed.createComponent(CustomSelectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
