import { TestBed } from '@angular/core/testing';

import { PrintOrderService } from './print-order.service';

describe('PrintOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintOrderService = TestBed.get(PrintOrderService);
    expect(service).toBeTruthy();
  });
});
