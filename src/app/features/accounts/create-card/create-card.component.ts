import { Component, OnInit } from "@angular/core";
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
  selector: "app-create-card",
  templateUrl: "./create-card.component.html",
  styleUrls: ["./create-card.component.scss"],
})
export class CreateCardComponent implements OnInit {
  card: any[] = [];
  add: boolean = false;
  cardType: "visa" | "mastercard";

  constructor(
    private cardService: CardService,
    private router: Router,
    private fb: FormBuilder,
    private getnotfsService: GetnotfsService,
    private notification: NotificationsService
  ) {}

  form!: FormGroup;

  // id: any = this.userservice.activeUser.id;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]
      ],
      account: ["", [
        Validators.required,
        Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{16}/gm)
      ]
      ],
      card: ["", [
          Validators.required,
          Validators.pattern(/^[0-9]{16}/gm)
        ]
      ],
      cardholder: ["", [Validators.required]],
      date: ["", [
          Validators.required,
          Validators.pattern(/^[0-9]{1,2}[/][0-9]{2}/g)
      ]
      ],
      amount: ["", [
          Validators.required,
          Validators.pattern(/[0-9]+/gm)
        ]
      ],
      security: [false, [Validators.required]],
      userId: [localStorage.getItem('userId')],
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

  security(e: any) {
    this.form.get("security")?.setValue(e);
  }

  submit() {
    this.cardService.create(this.form.value).subscribe((res) => {
      if (this.add) {
        setTimeout(() => {
          this.add = false;
        }, 2000);
      }
      this.router.navigate(["accounts"]);
    });

    this.getnotfsService.addNotf({
      userId: localStorage.getItem('userId'),
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
