import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

interface crypto {
  data: any;
  status: any;
}
// interface currency {
//   timestamp: any;
//   rates: any;
// }

@Component({
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

  constructor(private _http: HttpClient, private fb: FormBuilder,private user: UserService) {
    let regex = /^[a-zA-Z]+$/;
    this.form = this.fb.group({
      crypto: ["", [Validators.pattern(regex)]],
    });
  }
  ngOnInit(): void {
    console.log(this.user.activeUser);
    
    this._http
      .get<crypto>(
        "https://thingproxy.freeboard.io/fetch/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=REDACTED-COINMARKETCAP-KEY"
      )
      .subscribe((res) => {
        this.cryptoArray = res.data;
        this.VolumeSum = 0;
        for (let i of this.cryptoArray) {
          this.cryptoSymbol.push(i.symbol);
          this.VolumeSum += i.quote.USD.volume_24h;
        }
        this.secondaryArray = this.cryptoArray.slice();
      });

    //////////////////////////  currency   /////////////////////////////
    this._http
      .get<any>(
        "http://api.exchangeratesapi.io/v1/latest?access_key=REDACTED-EXCHANGERATES-KEY&format=1"
      )
      .subscribe((res) => {
        this.currencyArray = res;
        //console.log(this.currencyArray);
      });

    this._http
      .get(
        "https://rest.coinapi.io/v1/assets/icons/64x64?apikey=REDACTED-COINAPI-KEY"
      )
      .subscribe((res) => {
        for (let i of res as any) {
          this.iconMap.set(i.asset_id, i.url);
        }
  });

/////////////////////////////////////////////////////////////////////////////ვალუტები
    this._http.get<any>("https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json").subscribe(s=>{
      for(let i in (s[0].currencies as any)){
        (this.currency_arr as any)[i]={...(s[0].currencies as any)[i],icon:this.    flag_picker(),color:(this.rand_color()?"background-color:rgba(254, 77, 151,9%);    ":"background-color:rgba(109, 210, 48,9%);")};
    }
    
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
