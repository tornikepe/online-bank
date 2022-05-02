import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountsListComponent } from "./accounts-list/accounts-list.component";
import { CreateCardComponent } from "./create-card/create-card.component";

//info components
import { InfoPageComponent } from "./info-page/info-page.component";
import { MortgageComponent } from "./info-page/mortage/mortage.component";
import {CumulativeComponent} from "./info-page/cumulative/cumulative.component";
import {CardComponent} from "./info-page/card/card.component";

const routes: Routes = [
  // {
  //   path: "accounts/create-card",
  //   component: CreateCardComponent,
  // },
  {
    path: "",
    component: AccountsListComponent,
  },
  {
    path: "info",
    children: [
      {
        path: "card/:id",
        component: CardComponent,
      },
      {
        path: "cumulative/:id",
        component: CumulativeComponent,
      },
      {
        path: "mortage/:id",
        component: MortgageComponent,
      },
      {
        path: '**',
        component: AccountsListComponent
      }
    ],
  },
  {
    path: "create-card",
    component: CreateCardComponent,
  },
  // {
  //   path: "info",
  //   component: InfoPageComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
