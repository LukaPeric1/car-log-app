import { TestBed } from '@angular/core/testing';

import { CarLogService } from './car-log.service';

describe('CarLogService', () => {
  let service: CarLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
