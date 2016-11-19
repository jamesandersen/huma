/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SECDataService } from './sec-data.service';

describe('SECDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SECDataService]
    });
  });

  it('should ...', inject([SECDataService], (service: SECDataService) => {
    expect(service).toBeTruthy();
  }));
});
