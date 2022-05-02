import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { User } from 'src/app/auth/user.model'; 
import { Subscription, sample } from 'rxjs'; 
import { ApiService } from 'src/app/services/api.service'; 
import { UserService } from 'src/app/services/user.service'; 
import { SettingsService } from '../settings.service'; 
@Component({ 
	selector: 'app-settings-general-information', 
	templateUrl: './settings-general-information.component.html', 
	styleUrls: ['./settings-general-information.component.scss'], 
}) 
export class SettingsGeneralInformationComponent implements OnInit, OnDestroy { 
	//creating variables for checking forms validations here 
	public valid1: boolean = false; 
	public valid2: boolean = false; 
	public valid3: boolean = false; 
	public valid4: boolean = false; 
	//variables for styling to successful or unsuccessful inputs 
	public validStyle1: string; // input-warn OR input-success 
	public validStyle2: string; 
	public validStyle3: string; 
	public validStyle4: string; 
	public exform: FormGroup; 
	public form_2: FormGroup; 
	//Cancel & Update buttons
	private SubCancel: Subscription; 
	private SubUpdateButton: Subscription; 
	//User Info 
	public user: any; 
	public user_email: any; 
	public user_fullname: any; 
	public user_username: any; 
	public user_lastname: any; 
	public user_phone: any; 
	public user_language: string = 'English'; 
	public user_sex: string = 'Male'; 
	public nameSplit: any; //for splitting fullname 
	public nameDisplay: string; //for displaying current user on the page 
	//Default User Values to restore data after hitting Cancel Button 
	public user_username_temp: string; 
	public user_email_temp: string; 
	public user_lastname_temp: string; 
	public user_phone_temp: string; 
	public user_language_temp: string; 
	public user_sex_temp: string; 
	//Modal Triggers 
	public modalTriger: boolean = false; 
	public triger1: boolean = true; 
	public triger2: boolean = false; 
	private userObject: User = null!; 
 
	constructor( 
		private _api: ApiService, 
		private formBuilder: FormBuilder, 
		private settingsService: SettingsService, 
		private userService: UserService, 
		private apiService: ApiService 
	) {} 
	ngOnInit(): void { 
		//Get User ID 
		const userId = Number(localStorage.getItem('userId')); 
		//SEND GET Request. Get User Data 
		this.apiService 
			.getUserData(userId) 
			//setUser data to this.user 
			.subscribe(resData => { 
				this.user = { ...resData }; 
				///////User Data////////////////////// 
				this.user_email = this.user.email; 
				this.user_fullname = this.user.Full_Name.split(/\s+/); 
				this.user_username = this.user_fullname[0]; 
				this.user_lastname = this.user_fullname[1]; 
				this.user_phone = this.user.phone; 
				this.user_language = this.user.language; 
				this.user_sex = this.user.sex || 'Male'; 
				//////////////////////////////////////// 
				//Assigning user default values to variables 
				this.user_username_temp = this.user_username; 
				this.user_email_temp = this.user_email; 
				this.user_lastname_temp = this.user_lastname; 
				this.user_phone_temp = this.user_phone; 
				this.nameDisplay = this.user.Full_Name; 
			}); 
		//Form declaration 
		this.exform = this.formBuilder.group({ 
			email: ['', [Validators.required, Validators.email]], 
			firstname: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]], 
			lastname: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]], 
			phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]], 
		}); 
		//FIRSTNAME 
		this.exform.get('firstname')?.valueChanges.subscribe(res => { 
			if (this.exform.get('firstname')?.status == 'VALID') { 
				this.valid1 = false; 
				this.validStyle1 = 'input-success'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(false); 
			} else if (this.exform.get('firstname')?.status == 'INVALID') { 
				this.valid1 = true; 
				this.validStyle1 = 'input-warn'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(true); 
			} 
		}); 
		//EMAIL 
		this.exform.get('email')?.valueChanges.subscribe(res => { 
			if (this.exform.get('email')?.status == 'VALID') { 
				this.valid2 = false; 
				this.validStyle2 = 'input-success'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(false); 
			} else if (this.exform.get('email')?.status == 'INVALID') { 
				this.valid2 = true; 
				this.validStyle2 = 'input-warn'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(true); 
			} 
		}); 
		//LASTNAME 
		this.exform.get('lastname')?.valueChanges.subscribe(res => { 
			if (this.exform.get('lastname')?.status == 'VALID') { 
				this.valid3 = false; 
				this.validStyle3 = 'input-success'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(false); 
			} else if (this.exform.get('lastname')?.status == 'INVALID') { 
				this.valid3 = true; 
				this.validStyle3 = 'input-warn'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(true); 
			} 
		}); 
		//PHONE 
		this.exform.get('phone')?.valueChanges.subscribe(res => { 
			if (this.exform.get('phone')?.status == 'VALID') { 
				this.valid4 = false; 
				this.validStyle4 = 'input-success'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(false); 
			} else if (this.exform.get('phone')?.status == 'INVALID') { 
				this.valid4 = true; 
				this.validStyle4 = 'input-warn'; 
				this.settingsService.toggleCancelButton(true); 
				this.settingsService.disabledUpdateButton(true); 
			} 
		}); 
		// Listen to cancel button click 
		this.SubCancel = this.settingsService.cancelSettingsButtonClicked.subscribe(() => { 
			this.onCancelSettingsClick(); 
		}); 
		///////// Listen to Update button Click 
		this.SubUpdateButton = this.settingsService.updateSettingsButtonClicked.subscribe( 
			() => { 
				this.openModal(); 
			} 
		); 
		// Create Form Group for Modal 
		this.form_2 = this.formBuilder.group({ 
			password: ['', [Validators.required]], 
		}); 
	} 
	firstname!: string; 
	lastname!: string; 
	email!: string; 
	phone!: number; 
	sex!: string; 
	language!: string; 
	//getting values from inputs! 
	onInputValue1(event: any) { 
		this.firstname = event.target.value; 
		this.exform.get('firstname')?.patchValue(this.firstname); 
	} 
	onInputValue2(event: any) { 
		this.email = event.target.value; 
		this.exform.get('email')?.patchValue(this.email); 
	} 
	onInputValue3(event: any) { 
		this.lastname = event.target.value; 
		this.exform.get('lastname')?.patchValue(this.lastname); 
	} 
	onInputValue4(event: any) { 
		this.phone = event.target.value; 
		this.exform.get('phone')?.patchValue(this.phone); 
	} 
	selectLanguage(curLang: string) { 
		this.user_language = curLang; 
	} 
	selectSex(curSex: string) { 
		this.user_sex = curSex; 
	} 
	// Open Modal 
	openModal() {  
		this.modalTriger = true; 
	}  
	//Close Modal 
	close() { 
		this.modalTriger = false; 
	} 
	reset() { 
		this.modalTriger = false; 
	} 
	// Update User Information 
	Update() { 
		//Close Modal 
		this.modalTriger = false; 
		//Take Value From The Form 
		const password = this.form_2.controls['password'].value; 
		//Check and Take Email 
		let email = '';  
		if ( 
			this.exform.get('email')?.value === '' || 
			this.exform.get('email')?.value === undefined 
		) { 
			email = this.user_email; 
		} else { 
			email = this.exform.get('email')?.value; 
		} 
		//Check and take First Name 
		let fName = ''; 
		if ( 
			this.exform.get('firstname')?.value === '' || 
			this.exform.get('firstname')?.value === undefined 
		) { 
			fName = this.user_username; 
		} else {  
			fName = this.exform.get('firstname')?.value; 
		} 
		let lName = ''; 
		if ( 
			this.exform.get('lastname')?.value === '' || 
			this.exform.get('lastname')?.value === undefined 
		) { 
			lName = this.user_lastname; 
		} else { 
			lName = this.exform.get('lastname')?.value; 
		} 
		let tel = '';  
		if ( 
			this.exform.get('phone')?.value === '' || 
			this.exform.get('phone')?.value === undefined 
		) { 
			tel = this.user_phone; 
		} else { 
			tel = this.exform.get('phone')?.value; 
		} 
		//Create User Object 
		this.userObject = { 
			Agree_Term: true, 
			email: email, 
			Full_Name: fName + ' ' + lName, 
			password: password, 
			phone: tel, 
			language: this.user_language, 
			sex: this.user_sex, 
		}; 
		//Update User Info 
		this._api 
			.update_user_to_server_with_id(this.userObject, this.user.id) 
			.subscribe(res => { 
				this.settingsService.toggleCancelButton(false); 
				this.user_username_temp = this.user_username;  
				this.user_email_temp = this.user_email; 
				this.user_lastname_temp = this.user_lastname; 
				this.user_phone_temp = this.user_phone; 
				this.user_language_temp = this.user_language; 
				this.user_sex_temp = this.user_sex; 
				this.nameDisplay = this.user_username + ' ' + this.user_lastname; 
 
				alert('User Updated!'); 
			}); 
		//clear form 
		this.form_2.controls['password'].reset(); 
	} 
	onCancelSettingsClick() { 
		//User Template with default data 
		this.user_username = this.user_username_temp; 
		this.user_email = this.user_email_temp; 
		this.user_lastname = this.user_lastname_temp; 
		this.user_phone = this.user_phone_temp; 
		this.user_language = this.user_language_temp; 
		this.user_sex = this.user_sex_temp; 
		this.settingsService.disabledUpdateButton(true); 
	} 
	ngOnDestroy(): void { 
		this.SubUpdateButton.unsubscribe(); 
		this.SubCancel.unsubscribe(); 
		this.settingsService.toggleCancelButton(false); 
	} 
} 
