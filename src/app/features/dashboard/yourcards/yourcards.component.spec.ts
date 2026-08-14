import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardModule } from '../dashboard.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { YourcardsComponent } from './yourcards.component';

describe('YourcardsComponent', () => {
  let component: YourcardsComponent;
  let fixture: ComponentFixture<YourcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
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
