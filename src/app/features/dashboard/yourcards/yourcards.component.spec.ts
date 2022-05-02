import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourcardsComponent } from './yourcards.component';

describe('YourcardsComponent', () => {
  let component: YourcardsComponent;
  let fixture: ComponentFixture<YourcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourcardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
