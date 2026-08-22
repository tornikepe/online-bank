import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TestingSupportModule } from '../../../testing/testing-support.module';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, TestingSupportModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Every dropdown used to render name="category" on its radios, so two
     dropdowns on one page formed a single radio group and choosing a currency
     cleared the selected account. */
  it('gives each instance its own radio group', () => {
    const second = TestBed.createComponent(DropdownComponent);
    expect(second.componentInstance.groupName).not.toBe(component.groupName);
  });

  it('renders the instance group name on every radio', () => {
    fixture.componentRef.setInput('list', ['USD', 'EUR', 'GEL']);
    fixture.detectChanges();

    const names = Array.from(
      fixture.nativeElement.querySelectorAll('input[type=radio]') as NodeListOf<HTMLInputElement>
    ).map(input => input.name);

    expect(names.length).toBe(3);
    expect(new Set(names)).toEqual(new Set([component.groupName]));
  });

  /* Ids came from the item text, so repeated labels produced duplicate ids and
     a <label for> could point at a different dropdown's input. */
  it('gives every option a unique id, independent of its text', () => {
    fixture.componentRef.setInput('list', ['USD', 'USD', 'GEL']);
    fixture.detectChanges();

    const ids = Array.from(
      fixture.nativeElement.querySelectorAll('input[type=radio]') as NodeListOf<HTMLInputElement>
    ).map(input => input.id);

    expect(ids.length).toBe(3);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
