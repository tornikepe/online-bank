import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { User } from "../auth/user.model";

interface UsersDataType {
  agree_terms?: boolean;
  Email: string;
  full_name?: string;
  Password: string;
  auth_token?: string;
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private _http: HttpClient, private router: Router) {}

  /* რეგისტრაციის  რექვესთებისათვის გამოვიყენეთ მეთოდი POST შემდეგ მომხმარებლის პირად ინფორმაციაში რომ ჩაგვეწერა ტოკენი გამოვიყენეთ მეთოდი PUT ამის შედეგად უსერშო მივიღეთ ობიექტი სადაც გვაქვს ყველა საჭირო ინფორმაცია იუზერისთვის */

  SignUp(userData: UsersDataType) {
    return this._http
      .post<any>("http://localhost:3000/register", {
        email: userData.Email,
        password: userData.Password,
        Full_Name: userData.full_name,
        Agree_Term: userData.agree_terms,
      })
      .pipe(
        map((e) => {
          return e;
        })
      );
  }

  LogIn(email: string, password: string) {
    return this._http
      .post<any>("http://localhost:3000/login", {
        email: email,
        password: password,
      })
      .pipe(
        map((respone) => {
          return respone;
        })
      );
  }

  Get_User_Id_With_Email() {
    return this._http.get<any>("http://localhost:3000/users").pipe(
      map((response) => {
        return response;
      })
    );
  }
  update_user_to_server_with_id(user: User, id: number) {
    return this._http
      .put<any>(`http://localhost:3000/users/${id}`, { ...user })
      .pipe(
        map((response) => {
          return response;
        })
      );
    /*  თუ დაგჭირდებათ იუზერის სხვა მონაცემების გადაწოდება ამ მეთდისთვის მაშინ   UsersDataType- ინტერფეისში  დაამატეთ თქვენი პარამეტრი ოფშენალად. UsersDataType არის ამავე სერვისში აღწერილი ზემოთ, იუზერის მონაცემები შეგიძლიათ მოიპოვოთ user.service.ts ში get-ერის საშუალებით საიდანაც ამოიღებთ წარმატებით დალოგინებული მომხმარებლის ინფორმაციას. :) წარმატებები*/
  }

  getUserData(id: number) {
    return this._http.get<any>(`http://localhost:3000/users/${id}`);
  }

  DeleteUser(id: number) {
    return this._http.delete<any>(`http://localhost:3000/users/${id}`);
  }
}
