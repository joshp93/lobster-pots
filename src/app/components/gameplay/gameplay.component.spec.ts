import { CoolSessionStorage } from '@angular-cool/storage';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameplayComponent } from './gameplay.component';

describe('GameplayComponent', () => {
  let component: GameplayComponent;
  let fixture: ComponentFixture<GameplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameplayComponent ],
      providers: [CoolSessionStorage]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
