import { CoolSessionStorage } from '@angular-cool/storage';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupComponent } from './setup.component';

describe('SetupComponent', () => {
  let component: SetupComponent;
  let fixture: ComponentFixture<SetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupComponent ],
      providers: [CoolSessionStorage]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
