import { TestBed } from '@angular/core/testing';

import { ServiceGame } from './service-game';

describe('ServiceGame', () => {
  let service: ServiceGame;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGame);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
