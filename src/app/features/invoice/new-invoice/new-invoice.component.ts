import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged, Subscription, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Invoice, item } from '../invoice.model';
import { InvoicesService } from '../invoices.service';

@Component({
	selector: 'app-new-invoice',
	templateUrl: './new-invoice.component.html',
	styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
	public invoiceForm: FormGroup;
	public itemInputArray: AbstractControl[];
	public passInputValidClass: 'input-success' | '' = '';

	private SubForm: Subscription;

	constructor(
		private fb: FormBuilder,
		private invoicesService: InvoicesService,
		private router: Router
	) {}

	ngOnInit(): void {
		//Declaration of Invoice Form
		this.invoiceForm = this.fb.group({
			template: ['', [Validators.required]],
			invoiceNumber: ['', [Validators.required]],
			dateOfCreation: [{ value: new Date(), disabled: true }],
			dueDate: ['', [Validators.required]],
			companyName: ['', [Validators.required]],
			contactEmail: ['', [Validators.required, Validators.email]],
			address: ['', [Validators.required]],
			itemInputArray: new FormArray([
				new FormGroup({
					billingAddress: new FormControl('', Validators.required),
					itemQty: new FormControl('', Validators.required),
					price: new FormControl('', Validators.required),
				}),
			]),
		});

		//Get Selected Template Value
		const selectedTemplateValue = this.invoicesService.getSelectedTemplate;
		//set Template input Value
		this.invoiceForm.controls['template'].setValue(selectedTemplateValue);
		//Set Default itemInputArray
		this.itemInputArray = (<FormArray>this.invoiceForm.get('itemInputArray')).controls;

		// Listen To Input valueChange
		this.SubForm = this.invoiceForm.valueChanges
			.pipe(
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
				tap(() => {
					if (this.invoiceForm.valid) {
						// Set All Input Classes "'input-warn'" to "'input-success'"
						this.passInputValidClass = 'input-success';
					}
				})
			)
			.subscribe();
	}

	//Add item Inputs
	onAddItemInput() {
		(<FormArray>this.invoiceForm.get('itemInputArray')).push(
			new FormGroup({
				billingAddress: new FormControl('', Validators.required),
				itemQty: new FormControl('', Validators.required),
				price: new FormControl('', Validators.required),
			})
		);
		//Set Updated itemInputArray
		this.itemInputArray = (<FormArray>this.invoiceForm.get('itemInputArray')).controls;
	}

	onSendInvoice() {
		//If Form is invalid Cancel Function
		if (this.invoiceForm.invalid) {
			console.log('cancel');
			return;
		}

		//get Active Users Email From new invoice
		const userId = Number(localStorage.getItem('userId'));
		//Take Inputs Values
		const template = this.invoiceForm.controls['template'].value;
		const invoiceNumber = this.invoiceForm.controls['invoiceNumber'].value;
		const dateOfCreation = this.invoiceForm.controls['dateOfCreation'].value;
		const dueDate = this.invoiceForm.controls['dueDate'].value;
		const companyName = this.invoiceForm.controls['companyName'].value;
		const contactName = this.invoiceForm.controls['contactEmail'].value;
		const address = this.invoiceForm.controls['address'].value;
		const items: item[] = [];
		const status = 'Pending';
		//take Values From FormArray
		const arrayControl = this.invoiceForm.get('itemInputArray') as FormArray;
		for (let i = 0; i < arrayControl.length; i++) {
			//put Values in items array
			items.push({ ...arrayControl.at(i).value });
		}

		//Create new Invoice
		const invoice: Invoice = new Invoice(
			userId,
			template,
			invoiceNumber,
			dateOfCreation,
			dueDate,
			companyName,
			contactName,
			address,
			items,
			status
		);

		console.log(invoice);

		//set Post Request To Server
		this.invoicesService.sendNewInvoice(invoice).subscribe(
			resDate => {
				//clear form
				this.invoiceForm.reset();
				this.passInputValidClass = '';

				if (
					confirm('Invoice Send Successfully! Do you want to Return on Invoices Page')
				) {
					//redirect to invoices page
					this.router.navigate(['invoices']);
				}
			},
			error => {
				alert(error.message);
			}
		);
	}

	onCancelButton() {
		//On Cancel Button Click Redirect to invoices Page
		this.router.navigate(['invoices']);
	}

	ngOnDestroy(): void {
		this.SubForm.unsubscribe();
	}
}
