import { TestBed } from '@angular/core/testing';

import { GetPosterService } from './get-poster-service';

describe('GetPosterService', () => {
  let service: GetPosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPosterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
