import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-empty-transaction",
  templateUrl: "./empty-transaction.component.html",
  styleUrls: ["./empty-transaction.component.scss"],
})
export class EmptyTransactionComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onRouteToPayments() {
    // this.router.navigateByUrl('/user');
  }

  onChangePage() {
    this.router.navigateByUrl("/payments");
  }
}
