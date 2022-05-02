import { HttpClient } from "@angular/common/http";
import { UserService } from "./../../../services/user.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  isShown: boolean = false;
  userOb: any = {};
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    let userId = Number(localStorage.getItem("userId"));
    this.http
      .get<any>(`http://localhost:3000/users/${userId}`)
      .subscribe((Response) => {
        this.userOb = Response;
      });
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  onLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("id");
    this.router.navigate(["/sign-in"]);
  }
  btnClick() {
    this.router.navigateByUrl("/settings");
  }
  btnClicked() {
    this.router.navigateByUrl("/accounts");
  }
}
