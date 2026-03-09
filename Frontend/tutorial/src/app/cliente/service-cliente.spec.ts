import { TestBed } from '@angular/core/testing';

import { ServiceCliente } from './service-cliente';

describe('ServiceCliente', () => {
  let service: ServiceCliente;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCliente);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
