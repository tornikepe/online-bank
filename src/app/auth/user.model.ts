export class User {
	constructor(
		public Agree_Term: boolean,
		public Full_Name: string,
		public email: string,
		public id?: number,
		public password?: string,
		public phone?: string | number,
		public language?: string,
		public sex?: string
	) {}
}
