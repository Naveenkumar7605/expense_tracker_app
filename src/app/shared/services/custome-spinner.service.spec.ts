import { TestBed } from '@angular/core/testing';

import { CustomeSpinnerService } from './custome-spinner.service';

describe('CustomeSpinnerService', () => {
  let service: CustomeSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomeSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
