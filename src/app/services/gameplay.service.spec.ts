import { CoolSessionStorage } from '@angular-cool/storage';
import { TestBed } from '@angular/core/testing';

import { GameplayService } from './gameplay.service';

describe('GameplayService', () => {
  let service: GameplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoolSessionStorage]
    });
    service = TestBed.inject(GameplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
