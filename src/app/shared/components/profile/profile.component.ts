import { UserService } from "./../../../services/user.service";
import { Router } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject} from "@angular/core";
import { User } from 'src/app/models/banking.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: false,
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  isShown: boolean = false;
  userOb: Partial<User> = {};

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /* UserService owns the profile request and caches it, so the topbar no
       longer fires its own duplicate call to /users/:id. */
    this.userOb = this.userService.activeUser;
    this.userService.activeUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.userOb = user;
      this.cdr.markForCheck();
    });
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  onLogout() {
    this.userService.onLogout();
  }

  btnClick() {
    this.router.navigateByUrl("/settings");
  }

  btnClicked() {
    this.router.navigateByUrl("/accounts");
  }
}
