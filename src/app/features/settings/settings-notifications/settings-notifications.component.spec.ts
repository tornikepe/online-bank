import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModule } from '../settings.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { SettingsNotificationsComponent } from './settings-notifications.component';

describe('SettingsNotificationsComponent', () => {
	let component: SettingsNotificationsComponent;
	let fixture: ComponentFixture<SettingsNotificationsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
      imports: [SettingsModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SettingsNotificationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
