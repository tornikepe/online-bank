import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, ChangeDetectorRef} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

interface crypto {
  data: any;
  status: any;
}
// interface currency {
//   timestamp: any;
//   rates: any;
// }

@Component({
  standalone: false,
  selector: "app-currency",
  templateUrl: "./currency.component.html",
  styleUrls: ["./currency.component.scss"],
})
export class CurrencyComponent implements OnInit, OnDestroy {
  public cryptoArray: any[] = [];

  public currency_arr: any[] = [];

  public secondaryArray: any = [];

  public iconMap = new Map<string, string>();

  public cryptoSymbol: string[] = [];

  public VolumeSum: number = 0;

  public form: FormGroup = new FormGroup({});

  public filterString: string = "";
  ///////////////
  public currencyArray: any[] = [];

  constructor(private _http: HttpClient, private fb: FormBuilder,private user: UserService, private cdr: ChangeDetectorRef) {
    let regex = /^[a-zA-Z]+$/;
    this.form = this.fb.group({
      crypto: ["", [Validators.pattern(regex)]],
    });
  }
  ngOnInit(): void {
    /* Crypto listings. The original build called CoinMarketCap through a public
       CORS proxy with the key in the URL; the proxy is gone and no credentials
       belong in this repository. With `environment.crypto` blank we serve the
       bundled sample listing instead. */
    const cryptoUrl = environment.crypto.url || "assets/data/crypto.json";
    const cryptoOptions = environment.crypto.apiKey
      ? { headers: { "x-api-key": environment.crypto.apiKey } }
      : {};

    this._http.get<crypto>(cryptoUrl, cryptoOptions).subscribe((res) => {
      this.cryptoArray = res.data;
      this.VolumeSum = 0;
      for (let i of this.cryptoArray) {
        this.cryptoSymbol.push(i.symbol);
        this.VolumeSum += i.quote.USD.volume_24h;
        if (i.icon) {
          this.iconMap.set(i.symbol, i.icon);
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

  mathRounding(event: any) {
    return event.toFixed(2);
  }
  imageHasBeenLoaded(event: any) {
    event.url =
      "https://www.pngplay.com/wp-content/uploads/2/Bitcoin-PNG-Background.png";
    event.onerror = "";
    return true;
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
    this.currencyArray = [];
  }
}
