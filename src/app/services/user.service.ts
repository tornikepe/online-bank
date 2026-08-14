import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../interceptors/auth.service";

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
  constructor(
    private _http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  /* Profile of the signed-in user. Populated at sign-in and re-fetched once after
     a page reload, when only the id survives in localStorage. */
  private Active_User: any = {};

  /* Guards against re-requesting the profile on every change detection cycle
     while the first request is still in flight. */
  private isLoadingUser = false;

  /* Emits whenever the profile changes, so components can refresh without
     polling the getter from their templates. */
  private readonly activeUserSubject = new BehaviorSubject<any>({});
  readonly activeUser$ = this.activeUserSubject.asObservable();

  /* The id is written at sign-in and survives reloads, so it is available
     synchronously — services filtering data by user should rely on this rather
     than on `activeUser.id`, which is empty until the profile request lands. */
  get activeUserId(): number {
    return Number(localStorage.getItem("userId"));
  }

  get activeUser() {
    if (
      Object.keys(this.Active_User).length === 0 &&
      !this.isLoadingUser &&
      this.activeUserId
    ) {
      this.isLoadingUser = true;
      this._http
        .get<any>(`${environment.BaseUrl}users/${this.activeUserId}`)
        .subscribe({
          next: (res) => {
            this.setActiveUser(res);
            this.isLoadingUser = false;
          },
          error: () => {
            this.isLoadingUser = false;
          },
        });
    }
    return this.Active_User;
  }

  setActiveUser(user: ActiveUser) {
    /* Never keep the password hash around — the mock API returns it on GET /users. */
    const { password, ...safeUser } = user as any;
    this.Active_User = safeUser;
    if (safeUser.id !== undefined) {
      localStorage.setItem("userId", String(safeUser.id));
    }
    this.activeUserSubject.next(safeUser);
  }

  onLogout() {
    this.auth.clear();
    this.Active_User = {};
    this.activeUserSubject.next({});
    this.router.navigate(["/sign-in"]);
  }
}
