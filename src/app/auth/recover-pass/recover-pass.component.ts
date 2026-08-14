import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../services/api.service";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from "src/app/shared/notifications/notifications.service";
@Component({
  standalone: false,
  selector: "app-recover-pass",
  templateUrl: "./recover-pass.component.html",
  styleUrls: ["./recover-pass.component.scss"],
})
export class RecoverPassComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private destr: any;
  public form: FormGroup = new FormGroup({});
  public form_2: FormGroup = new FormGroup({});

  protected Recover_Id: any;
  protected currntEmail: any;
  protected currntFullName: any;
  protected currentAgree: any;

  public triger1: boolean = true;
  public triger2: boolean = false;

  private input: any;
  public valid: boolean = true;

  public ValueForInput: string = "";
  public input_class: any = "";

  public modalTriger: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _api: ApiService,
    private _http: HttpClient,
    private router: Router, private cdr: ChangeDetectorRef, private notification: NotificationsService) {
    this.form_2 = this._fb.group({
      password: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
    this.form.get("email")?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (this.form.get("email")?.status == "VALID") {
        this.valid = false;
        this.input_class = "input-success";
      } else if (this.form.get("email")?.status == "INVALID") {
        this.valid = true;
        this.input_class = "input-warn";
      }
          this.cdr.markForCheck();
    });
  }

  onSubmit() {
    // console.log("success");
    this.modalTriger = true;
    this._api.Get_User_Id_With_Email().subscribe(
      (res) => {
        const user = res.find((params: any) => {
          return params.email == this.form.get("email")?.value;
        });
        if (user) {
          this.triger1 = true;
          this.triger2 = false;
          this.Recover_Id = user.id;
          this.currntEmail = this.form.get("email")?.value;
          this.currntFullName = user.Full_Name;
          this.currentAgree = user.Agree_Term;
        } else {
          this.triger1 = false;
          this.triger2 = true;
        }
        // this.form.reset()
        this.ValueForInput = "";
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

  Update() {
    this._http
      .put<any>(`${environment.BaseUrl}users/${this.Recover_Id}`, {
        // ...obj
        email: this.currntEmail,
        password: this.form_2.get("password")?.value,
        Full_Name: this.currntFullName,
        Agree_Term: this.currentAgree,
      })
      .subscribe(
        (res) => {
          this.form_2.reset();
          this.modalTriger = false;
          this.valid = false;
          this.router.navigate(["/sign-in"]);
                  this.cdr.markForCheck();
        },
        (error) => {
          this.valid = false;
          this.notification.open({
          class: 'secondary-pink',
          text: String(error.error),
        });
                  this.cdr.markForCheck();
        }
      );
  }
  reset() {
    this.modalTriger = false;
    // this.form.reset()
    this.valid = false;
  }
  close() {
    this.modalTriger = false;
  }
}
