import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../interceptors/auth.service';
import { ApiService } from '../../services/api.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
	standalone: false,
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

	public form: FormGroup = new FormGroup({});
	private Email_Value: string = '';
	public input_valid: string = '';
	public input_valid_pass: string = '';

	public valid_1: boolean = true;
	public valid_2: boolean = true;

  public inputCredintial: string = "";
  public errorMessage: string = "";

  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private userService: UserService, private cdr: ChangeDetectorRef) {
    if (localStorage.getItem("Credentials")) {
      const email = JSON.parse(localStorage.getItem("Credentials") as string);
      this.inputCredintial = email.email;
    } else {
      this.inputCredintial = "";
    }
    this.form = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      check: ["", []],
    });
  }

  ngOnInit() {
    this.form.get("email")?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (this.form.get("email")?.status == "VALID") {
        this.input_valid = "input-success";
        this.valid_1 = false;
      } else if (this.form.get("email")?.status == "INVALID") {
        this.input_valid = "input-warn";
        this.valid_1 = true;
      }
          this.cdr.markForCheck();
    });

    this.form
      .get("password")
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
        if (this.form.get("password")?.status == "VALID") {
          this.input_valid_pass = "input-success";
          this.valid_2 = false;
        } else if (this.form.get("password")?.status == "INVALID") {
          this.input_valid_pass = "input-warn";
          this.valid_2 = true;
        }
              this.cdr.markForCheck();
      });
  }

  onSubmit() {
    if ((this.form.get("check") as FormControl).value) {
      const Email = (this.form.get("email") as FormControl).value;
      localStorage.setItem(`Credentials`, JSON.stringify({ email: Email }));
    }
    this._api
      .LogIn(this.form.get("email")?.value, this.form.get("password")?.value)
      .subscribe({
        next: (res) => {
          /* Store the raw token — wrapping it in quotes made every
             Authorization header malformed. */
          this.auth.setToken(res.accessToken);
          this.userService.setActiveUser(res.user);

          /* Send the user back where the guard interrupted them, or to the
             dashboard when they came to sign in directly. */
          const returnUrl =
            this.route.snapshot.queryParamMap.get("returnUrl") || "/dashboard";
          this.router.navigateByUrl(returnUrl);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.errorMessage =
            typeof error.error === "string"
              ? error.error
              : "Sign in failed. Check your email and password.";
          this.cdr.markForCheck();
        },
      });
  }

}
