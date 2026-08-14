import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { guestGuard } from "./guard/auth.guard";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { RecoverPassComponent } from "./auth/recover-pass/recover-pass.component";

/* The signed-in area lives in LayoutModule, which registers the "" route and
   protects it with authGuard. Everything below is reachable while signed out. */
const routes: Routes = [
  { path: "sign-in", component: SignInComponent, canActivate: [guestGuard] },
  { path: "sign-up", component: SignUpComponent, canActivate: [guestGuard] },
  {
    path: "recover-password",
    component: RecoverPassComponent,
    canActivate: [guestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
