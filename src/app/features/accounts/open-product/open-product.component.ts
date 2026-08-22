import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Deposit, Loan } from "src/app/models/banking.model";
import { CardService } from "../card.service";
import { GetnotfsService } from "../../../services/getnotfs.service";
import { NotificationsService } from "../../../shared/notifications/notifications.service";

type ProductKind = "deposit" | "credit";

/**
 * Opens a new deposit or credit.
 *
 * Both products are the same form with different words and a different
 * endpoint, so one component covers them and the route decides which.
 */
@Component({
  standalone: false,
  selector: "app-open-product",
  templateUrl: "./open-product.component.html",
  styleUrls: ["./open-product.component.scss"],
})
export class OpenProductComponent implements OnInit {
  form!: FormGroup;
  kind: ProductKind = "deposit";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    private getnotfsService: GetnotfsService,
    private notification: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.kind =
      this.route.snapshot.paramMap.get("type") === "credit" ? "credit" : "deposit";

    this.form = this.fb.group({
      name: ["", [Validators.required]],
      account: [
        "",
        [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,26}$/)],
      ],
      amount: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      rate: ["", [Validators.required, Validators.pattern(/^[0-9]{1,2}(\.[0-9])?$/)]],
      term: ["", [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
    });
  }

  get isDeposit(): boolean {
    return this.kind === "deposit";
  }

  get title(): string {
    return this.isDeposit ? "Open new deposit" : "Open new credit";
  }

  get amountLabel(): string {
    return this.isDeposit ? "Initial deposit" : "Amount to borrow";
  }

  get submitLabel(): string {
    return this.isDeposit ? "OPEN DEPOSIT" : "OPEN CREDIT";
  }

  /** Expiry is the start date plus the chosen term, formatted MM/YY. */
  private endDate(months: number): string {
    const end = new Date();
    end.setMonth(end.getMonth() + months);
    return `${String(end.getMonth() + 1).padStart(2, "0")}/${String(
      end.getFullYear()
    ).slice(-2)}`;
  }

  private startDate(): string {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, "0")}/${String(
      now.getFullYear()
    ).slice(-2)}`;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { name, account, amount, rate, term } = this.form.value;
    const userId = Number(localStorage.getItem("userId"));
    const value = Number(amount);

    const common = {
      name,
      account,
      rate: Number(rate),
      dateStart: this.startDate(),
      dateExp: this.endDate(Number(term)),
      userId,
    };

    const request: Observable<Deposit | Loan> = this.isDeposit
      ? this.cardService.createDeposit({ ...common, balance: value, accured: 0 })
      : this.cardService.createLoan({
          ...common,
          startingAmount: value,
          paidAmount: 0,
        });

    request.subscribe({
      next: () => {
        this.getnotfsService
          .addNotf({
            userId,
            title: this.isDeposit ? "deposit opened" : "credit opened",
            value: `${name} has been opened and is now listed under your accounts`,
            link: "accounts",
          })
          .subscribe();

        this.notification.open({
          class: "secondary-green",
          text: this.isDeposit
            ? "Deposit opened successfully"
            : "Credit opened successfully",
        });

        this.router.navigate(["accounts"]);
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.open({
          class: "secondary-pink",
          text: "Could not open the account. Please try again.",
        });
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    this.router.navigate(["accounts"]);
  }
}
