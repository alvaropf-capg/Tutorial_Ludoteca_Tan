import { TestBed } from '@angular/core/testing';

import { ServiceAuthor } from './service-author';

describe('ServiceAuthor', () => {
  let service: ServiceAuthor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAuthor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
