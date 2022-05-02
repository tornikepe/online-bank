import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CurrencyRoutingModule } from "./currency-routing.module";
import { CurrencyComponent } from "./currency/currency.component";
import { NumberSuffixPipe } from "./currency/currencyPipe";
import { ReactiveFormsModule } from "@angular/forms";
import { SearchPipe } from "./currency/search.pipe";

@NgModule({
  declarations: [CurrencyComponent, NumberSuffixPipe, SearchPipe],
  imports: [
    CommonModule,
    SharedModule,
    CurrencyRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [CurrencyComponent, NumberSuffixPipe],
})
export class CurrencyModule {}
