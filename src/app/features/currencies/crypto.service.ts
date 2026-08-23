import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

/**
 * Live cryptocurrency listings.
 *
 * The original build called CoinMarketCap through a public CORS proxy with the
 * key in the URL. The proxy is gone, the key has been revoked, and no
 * credentials belong in this repository — so the page fell back to a snapshot
 * committed under assets/, which meant the prices were frozen in the past.
 *
 * CoinGecko's public endpoint needs no key, sends `access-control-allow-origin: *`
 * and carries every figure the table shows, so the page can be live again. The
 * response is reshaped into the CoinMarketCap layout the template was written
 * against, and the bundled snapshot still answers if the network call fails.
 */

/** One row of the crypto table, in the shape the template reads. */
export interface CryptoListing {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      market_cap: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
    };
  };
}

/** The fields this service reads from a CoinGecko market row. */
interface CoinGeckoCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  total_volume: number;
  market_cap: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
}

const MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false" +
  "&price_change_percentage=1h%2C24h%2C7d";

const SNAPSHOT_URL = "assets/data/crypto.json";

@Injectable({ providedIn: "root" })
export class CryptoService {
  constructor(private http: HttpClient) {}

  /** Live listings, falling back to the bundled snapshot if the API is unreachable. */
  getListings(): Observable<CryptoListing[]> {
    return this.http.get<CoinGeckoCoin[]>(MARKETS_URL).pipe(
      map((coins) => coins.map((coin) => this.toListing(coin))),
      catchError(() => this.snapshot())
    );
  }

  private snapshot(): Observable<CryptoListing[]> {
    return this.http
      .get<{ data: CryptoListing[] }>(SNAPSHOT_URL)
      .pipe(
        map((body) => body.data ?? []),
        catchError(() => of([]))
      );
  }

  private toListing(coin: CoinGeckoCoin): CryptoListing {
    return {
      id: coin.id,
      name: coin.name,
      /* The table filters on an uppercase symbol; CoinGecko sends lower case. */
      symbol: coin.symbol.toUpperCase(),
      icon: coin.image,
      quote: {
        USD: {
          price: coin.current_price,
          volume_24h: coin.total_volume,
          market_cap: coin.market_cap,
          /* A coin listed in the last hour/day/week has no figure for that
             window yet, and the template does arithmetic on it. */
          percent_change_1h: coin.price_change_percentage_1h_in_currency ?? 0,
          percent_change_24h: coin.price_change_percentage_24h_in_currency ?? 0,
          percent_change_7d: coin.price_change_percentage_7d_in_currency ?? 0,
        },
      },
    };
  }
}
