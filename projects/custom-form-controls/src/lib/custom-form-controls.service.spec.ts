import { TestBed } from '@angular/core/testing';

import { CustomFormControlsService } from './custom-form-controls.service';

describe('CustomFormControlsService', () => {
  let service: CustomFormControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFormControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
