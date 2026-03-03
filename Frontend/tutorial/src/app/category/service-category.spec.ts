import { TestBed } from '@angular/core/testing';

import { ServiceCategory } from './service-category';

describe('ServiceCategory', () => {
  let service: ServiceCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
