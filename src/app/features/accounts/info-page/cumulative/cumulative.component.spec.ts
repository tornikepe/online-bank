import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsModule } from '../../accounts.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../../testing/testing-support.module';
import { CumulativeComponent } from './cumulative.component';

describe('CumulativeComponent', () => {
  let component: CumulativeComponent;
  let fixture: ComponentFixture<CumulativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
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
