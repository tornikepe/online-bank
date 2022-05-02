import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageComponent } from './mortage.component';

describe('MortageComponent', () => {
  let component: MortgageComponent;
  let fixture: ComponentFixture<MortgageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
