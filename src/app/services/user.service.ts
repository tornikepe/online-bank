import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

interface ActiveUser {
  Agree_Term?: boolean;
  Full_Name?: string;
  email?: string;
  id?: number;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private _http: HttpClient, private router: Router) {}

  private Active_User: any = {
    /* ესაა აქტიური იუზერის ინფორმაცია აქ ინახება შემდეგი სახის ინფორმაცია  */
    /* ი ნ ს ტ რ უ ქ ც ი ა  */
    // Agree_Term?: boolean;
    // Full_Name?: string;
    // email?: string;
    // id?: number
  };
  get activeUser() {
    let userId = Number(localStorage.getItem("userId"));
    if (Object.keys(this.Active_User).length === 0) {
      this._http
        .get<any>(`http://localhost:3000/users/${userId}`)
        .subscribe((res) => {
          this.Active_User = { ...res, password: undefined };
        });
    }
    return this.Active_User;
  }

  setActiveUser(user: ActiveUser) {
    this.Active_User = user;
    localStorage.setItem("userId", JSON.stringify(user.id));
  }

  onLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("id");
    this.router.navigate(["/sign-in"]);
  }
}
