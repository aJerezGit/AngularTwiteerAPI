import { TestBed } from '@angular/core/testing';

import { TwitsService } from './twits.service';

describe('TwitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TwitsService = TestBed.get(TwitsService);
    expect(service).toBeTruthy();
  });
});
