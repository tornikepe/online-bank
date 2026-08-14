import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ApiService } from "../../services/api.service";

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from "src/app/shared/notifications/notifications.service";
@Component({
  standalone: false,
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  public boolValid: boolean = true;

  public error_p_class = "register_error";

  public input_valid_1: string = "";
  public input_valid_2: string = "";
  public input_valid_3: string = "";

  constructor(
    private _api: ApiService,
    private _router: Router,
    private user: UserService, private cdr: ChangeDetectorRef, private notification: NotificationsService) {}

  public forms = new FormGroup({
    full_name: new FormControl("", [Validators.required]),

    Email: new FormControl("", [Validators.required, Validators.email]),

    Password: new FormControl("", [Validators.required]),

    agree_terms: new FormControl("", [Validators.required]),
  });
  ngOnInit(): void {
    this.check();
    //==============
    this.forms
      .get("full_name")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
        if (this.forms.get("full_name")?.status == "VALID") {
          this.input_valid_1 = "input-success";
        } else if (this.forms.get("full_name")?.status == "INVALID") {
          this.input_valid_1 = "input-warn";
        }
              this.cdr.markForCheck();
      });
    //======
    this.forms.get("Email")?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (this.forms.get("Email")?.status == "VALID") {
        this.input_valid_2 = "input-success";
      } else if (this.forms.get("Email")?.status == "INVALID") {
        this.input_valid_2 = "input-warn";
      }
          this.cdr.markForCheck();
    });
    //=====
    this.forms.get("Password")?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (this.forms.get("Password")?.status == "VALID") {
        this.input_valid_3 = "input-success";
      } else if (this.forms.get("Password")?.status == "INVALID") {
        this.input_valid_3 = "input-warn";
      }
          this.cdr.markForCheck();
    });
  }
  // parentComponentMethod_1(val: any) {
  //   (this.forms.get("full_name") as FormControl).patchValue(val);
  // }
  // parentComponentMethod_2(val: any) {
  //   (this.forms.get("Email") as FormControl).patchValue(val);
  // }
  // parentComponentMethod_3(val: any) {
  //   (this.forms.get("Password") as FormControl).patchValue(val);
  // }
  check() {
    (this.forms as FormGroup).statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (
        this.forms.status == "VALID" &&
        (this.forms.get("agree_terms") as FormControl).value == true
      ) {
        this.boolValid = false;
      } else this.boolValid = true;
          this.cdr.markForCheck();
    });
  }

  onSubmit() {
    const { full_name, Email, Password, agree_terms } = this.forms.getRawValue();
    this._api
      .SignUp({
        full_name: full_name ?? "",
        Email: Email ?? "",
        Password: Password ?? "",
        agree_terms: !!agree_terms,
      })
      .subscribe(
      (res) => {
        this.forms.reset();
        this._router.navigate(["/sign-in"]);
              this.cdr.markForCheck();
      },
      (error) => {
        this.notification.open({
          class: 'secondary-pink',
          text: String(error.error),
        });
              this.cdr.markForCheck();
      }
    );
  }
}
