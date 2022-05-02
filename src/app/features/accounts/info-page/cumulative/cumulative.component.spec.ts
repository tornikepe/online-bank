import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeComponent } from './cumulative.component';

describe('CumulativeComponent', () => {
  let component: CumulativeComponent;
  let fixture: ComponentFixture<CumulativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CumulativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CumulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
