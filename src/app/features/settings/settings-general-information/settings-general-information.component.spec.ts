import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsGeneralInformationComponent } from './settings-general-information.component';

describe('SettingsGeneralInformationComponent', () => {
	let component: SettingsGeneralInformationComponent;
	let fixture: ComponentFixture<SettingsGeneralInformationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsGeneralInformationComponent],
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
