import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CardService } from "../card.service";
import { UserService } from "../../../services/user.service";
import {GetnotfsService} from "../../../services/getnotfs.service";
import {NotificationsService} from "../../../shared/notifications/notifications.service";

@Component({
  standalone: false,
  selector: "app-create-card",
  templateUrl: "./create-card.component.html",
  styleUrls: ["./create-card.component.scss"],
})
export class CreateCardComponent implements OnInit {
  add: boolean = false;
  cardType: "visa" | "mastercard";

  constructor(
    private cardService: CardService,
    private router: Router,
    private fb: FormBuilder,
    private getnotfsService: GetnotfsService,
    private notification: NotificationsService, private cdr: ChangeDetectorRef) {}

  form!: FormGroup;


  /* These patterns must not carry the `g` flag. A global RegExp keeps `lastIndex`
     between calls, so the repeated `.test()` Angular runs while validating
     alternates between true and false — four of the six fields reported
     themselves invalid while holding a perfectly good value, and the submit
     button could never enable. */
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      account: [
        "",
        [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{16}$/)],
      ],
      card: ["", [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      cardholder: ["", [Validators.required]],
      date: ["", [Validators.required, Validators.pattern(/^[0-9]{1,2}\/[0-9]{2}$/)]],
      amount: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      security: [false],
      userId: [Number(localStorage.getItem("userId"))],
    });
  }
  get type(){
    let temp = this.form.get('card')?.value
    if(temp[0] == '4') {
      return 'visa'
    } else if(temp[0]){
      return 'mastercard'
    }
    return 'none'
  }
  get inputs() {
    return this.form.controls;
  }

  security(e: boolean) {
    this.form.get("security")?.setValue(e);
  }

  submit() {
    /* Store the balance as a number. Cards created here used to save it as the
       raw string from the input, and a string balance makes `+` concatenate
       when money is transferred into the card. */
    const card = {
      ...this.form.value,
      amount: Number(this.form.value.amount),
      userId: Number(this.form.value.userId),
    };

    this.cardService.create(card).subscribe((res) => {
      if (this.add) {
        setTimeout(() => {
          this.add = false;
        }, 2000);
      }
      this.router.navigate(["accounts"]);
          this.cdr.markForCheck();
    });

    this.getnotfsService.addNotf({
      userId: Number(localStorage.getItem('userId')),
      title: 'card created',
      value: 'card has been created in your account and it can be accessed in accounts',
      link: 'accounts'
    }).subscribe()
    this.notification.open({
      class: 'blue',
      text: 'card has been added successfully'
    });
  }
}
