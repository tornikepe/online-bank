import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { CryptoListing, CryptoService } from "../crypto.service";
/**
 * One currency as the National Bank of Georgia publishes it, plus the two
 * presentation fields the table adds when it builds the row.
 */
export interface CurrencyRate {
  code: string;
  name: string;
  /** The rate is quoted for this many units — 1, 10, 100 or 1000. */
  quantity: number;
  rate: number;
  rateFormated: string;
  /** Absolute move against the previous rate, in lari. */
  diff: number;
  diffFormated: string;
  /** The day the rate was set. */
  date: string;
  /** The day it takes effect — what the bank shows as the rate's date. */
  validFromDate: string;
  /** Added client-side when the row is built. */
  icon?: string;
  color?: string;
}

@Component({
  standalone: false,
  selector: "app-currency",
  templateUrl: "./currency.component.html",
  styleUrls: ["./currency.component.scss"],
})
export class CurrencyComponent implements OnInit, OnDestroy {
  public cryptoArray: CryptoListing[] = [];

  public currency_arr: CurrencyRate[] = [];

  public secondaryArray: CryptoListing[] = [];

  public iconMap = new Map<string, string>();

  public cryptoSymbol: string[] = [];

  public VolumeSum: number = 0;

  public form: FormGroup = new FormGroup({});

  public filterString: string = "";

  constructor(
    private _http: HttpClient,
    private fb: FormBuilder,
    private user: UserService,
    private cdr: ChangeDetectorRef,
    private crypto: CryptoService
  ) {
    let regex = /^[a-zA-Z]+$/;
    this.form = this.fb.group({
      crypto: ["", [Validators.pattern(regex)]],
    });
  }
  ngOnInit(): void {
    /* Live listings from CoinGecko, which needs no key; the service falls back
       to the bundled snapshot if the call fails. */
    this.crypto.getListings().subscribe((listings: CryptoListing[]) => {
      this.cryptoArray = listings;
      this.VolumeSum = 0;
      this.cryptoSymbol = [];
      this.iconMap.clear();
      for (const coin of listings) {
        this.cryptoSymbol.push(coin.symbol);
        this.VolumeSum += coin.quote.USD.volume_24h;
        if (coin.icon) {
          this.iconMap.set(coin.symbol, coin.icon);
        }
      }
      this.secondaryArray = this.cryptoArray.slice();
      this.cdr.markForCheck();
    });

/////////////////////////////////////////////////////////////////////////////ვალუტები
    this._http.get<any>("https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json").subscribe(s=>{
      for(let i in (s[0].currencies as any)){
        (this.currency_arr as any)[i]={...(s[0].currencies as any)[i],icon:this.    flag_picker(),color:(this.rand_color()?"background-color:rgba(254, 77, 151,9%);    ":"background-color:rgba(109, 210, 48,9%);")};
    }
    
      this.cdr.markForCheck();
  })



/////////////////////////////////////////////////////////////////////////////ვალუტები



  }

  /**
   * How many decimals a price needs to stay honest. Two is right for bitcoin
   * and wrong for anything trading under a cent: `toFixed(2)` turned a coin at
   * $0.0000094 into $0.00. Widen the window as the price shrinks.
   */
  priceDigits(price: number): string {
    const value = Math.abs(price);
    if (value >= 1) return "1.2-2";
    if (value >= 0.01) return "1.2-4";
    if (value >= 0.0001) return "1.2-6";
    return "1.2-8";
  }
  /**
   * The bank publishes `diff` as an absolute move in lari, not a fraction. The
   * table used to pipe it straight through `percent`, which simply multiplied
   * it by a hundred — a 0.0014 lari move on a 7.11 rate was printed as -0.14%
   * when it is -0.02%. Divide by yesterday's rate to get the real one.
   *
   * The sign stays on the number so `percent` renders the minus itself, the
   * same way the crypto table does it; `sign()` only adds the plus.
   */
  dailyChange(row: { rate: number; diff: number }): number {
    const previous = row.rate - row.diff;
    if (!previous) {
      return 0;
    }
    return row.diff / previous;
  }

  sign(temp: number): "+" | "" {
    if (temp >= 0) {
      return "+";
    } else return "";
  }
  colorChanger(event: number): boolean {
    if (event >= 0) {
      return true;
    } else return false;
  }

  search() {
    this.cryptoArray = this.secondaryArray.slice();
    this.filterString = this.form.get("crypto")?.value as string;
    this.cryptoArray = this.cryptoArray.filter((obj) =>
      obj.symbol.startsWith(this.filterString.toUpperCase())
    );
  }
private flag_picker():string{
const url_:string=`../../../../assets/images/auth/${Math.floor(Math.random() * (5 - 1 + 1) + 1)}.png`;
//console.log(url_);
return url_;
  }
  public rand_color():boolean{
    return Math.random()>0.5;
  }

  ngOnDestroy(): void {
    this.cryptoArray = [];
    this.currency_arr = [];
  }
}
