import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModule } from '../settings.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { SettingsGeneralInformationComponent } from './settings-general-information.component';

describe('SettingsGeneralInformationComponent', () => {
	let component: SettingsGeneralInformationComponent;
	let fixture: ComponentFixture<SettingsGeneralInformationComponent>;

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
		fixture = TestBed.createComponent(SettingsGeneralInformationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
