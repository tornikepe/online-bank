import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsOverviewComponent } from './funds-overview.component';

describe('FundsOverviewComponent', () => {
  let component: FundsOverviewComponent;
  let fixture: ComponentFixture<FundsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
