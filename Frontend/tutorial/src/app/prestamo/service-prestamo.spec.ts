import { TestBed } from '@angular/core/testing';

import { ServicePrestamo } from './service-prestamo';

describe('ServicePrestamo', () => {
  let service: ServicePrestamo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicePrestamo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
