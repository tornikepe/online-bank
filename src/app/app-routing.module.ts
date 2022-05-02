import { NotificationsComponent } from "./shared/notifications/notifications.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./layout/main/main.component";
import { AuthGuard } from "./guard/auth.guard";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { RecoverPassComponent } from "./auth/recover-pass/recover-pass.component";
import { AccountsListComponent } from "./features/accounts/accounts-list/accounts-list.component";
// import { TransactionsComponent } from './features/transactions/transactions.component';
// import { InfoPageComponent } from "./accounts/info-page/info-page.component";

const routes: Routes = [
  /* !!! I M P O R T A N T !!! */
  /* თუ თქვენი როუტის დაცვა გჭირდებათ არაავტორიზებული იუზერებისგან
  {path:'შენი როუტის სახელი', component: შენი კომპონენტი, canActivate: [AuthGuard]}  
  */

  // {
  //   path: "",
  //   loadChildren: () =>
  //     import("./layout/layout.module").then((m) => m.LayoutModule),
  //   canActivate: [AuthGuard],
  // },
  { path: "sign-in", component: SignInComponent },
  // { path: "transactions", component: TransactionsComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "recover-password", component: RecoverPassComponent },
  // { path: 'account-list', component: AccountsListComponent },
  // { path: 'info', component:InfoPageComponent },
  /* 
   {
    path: '',
    loadChildren: () => imgport('./accounts/accounts.module').then(m => m.AccountsModule),
}
*/
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
