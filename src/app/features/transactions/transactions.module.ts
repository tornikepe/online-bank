import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { CommonModule } from "@angular/common";
import { SearchComponent } from "./search/search.component";
import { FilterByTypeComponent } from "./filter-by-type/filter-by-type.component";
import { SortByDateComponent } from "./sort-by-date/sort-by-date.component";
import { TransactionsComponent } from "./transactions.component";
import { EmptyTransactionComponent } from "./empty-transaction/empty-transaction.component";
import { ModalComponent } from "./modal/modal.component";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [{ path: "", component: TransactionsComponent }];

@NgModule({
  declarations: [
    TransactionsComponent,
    SearchComponent,
    SortByDateComponent,
    FilterByTypeComponent,
    ModalComponent,
    EmptyTransactionComponent,
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [TransactionsComponent],
})
export class TransactionsModule { }
