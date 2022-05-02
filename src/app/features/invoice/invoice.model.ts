export interface item {
	billingAddress: string;
	itemQty: number;
	price: number;
}
export class Invoice {
	constructor(
		public userId: number,
		public template: string,
		public invoiceNumber: number,
		public dateOfCreation: Date,
		public dueDate: Date,
		public companyName: string,
		public contactName: string,
		public address: string,
		public items: item[],
		public status: 'Paid' | 'Pending' | 'Cancelled',
		public id?: number,
		public amount?: number
	) {}
}
