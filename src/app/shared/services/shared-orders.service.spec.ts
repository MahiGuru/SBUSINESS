import { TestBed } from '@angular/core/testing';

import { SharedOrdersService } from './shared-orders.service';

describe('SharedOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedOrdersService = TestBed.get(SharedOrdersService);
    expect(service).toBeTruthy();
  });
});
