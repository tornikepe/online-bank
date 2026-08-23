import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;
  let http: HttpTestingController;

  const coin = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://example.test/btc.png',
    current_price: 75962,
    total_volume: 29_000_000_000,
    market_cap: 2_000_000_000_000,
    price_change_percentage_1h_in_currency: 0.4,
    price_change_percentage_24h_in_currency: -2.1,
    price_change_percentage_7d_in_currency: 20.5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CryptoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /* The table was written against CoinMarketCap's layout, so the mapping is
     what keeps the template working against a different provider. */
  it('reshapes a CoinGecko row into the layout the table reads', async () => {
    const pending = firstValueFrom(service.getListings());

    http.expectOne(req => req.url.includes('coingecko')).flush([coin]);

    const [row] = await pending;
    expect(row.symbol).toBe('BTC');
    expect(row.icon).toBe('https://example.test/btc.png');
    expect(row.quote.USD.price).toBe(75962);
    expect(row.quote.USD.volume_24h).toBe(29_000_000_000);
    expect(row.quote.USD.market_cap).toBe(2_000_000_000_000);
    expect(row.quote.USD.percent_change_24h).toBe(-2.1);
  });

  /* A coin listed within the window has no figure for it, and the template
     divides and formats that value. */
  it('substitutes zero for a missing change percentage', async () => {
    const pending = firstValueFrom(service.getListings());

    http.expectOne(req => req.url.includes('coingecko')).flush([
      { ...coin, price_change_percentage_7d_in_currency: null },
    ]);

    const [row] = await pending;
    expect(row.quote.USD.percent_change_7d).toBe(0);
  });

  it('falls back to the bundled snapshot when the API is unreachable', async () => {
    const pending = firstValueFrom(service.getListings());

    http
      .expectOne(req => req.url.includes('coingecko'))
      .error(new ProgressEvent('offline'));
    http
      .expectOne('assets/data/crypto.json')
      .flush({ data: [{ name: 'Bitcoin', symbol: 'BTC' }] });

    const rows = await pending;
    expect(rows.length).toBe(1);
    expect(rows[0].symbol).toBe('BTC');
  });

  it('returns an empty list rather than failing when both sources are gone', async () => {
    const pending = firstValueFrom(service.getListings());

    http
      .expectOne(req => req.url.includes('coingecko'))
      .error(new ProgressEvent('offline'));
    http
      .expectOne('assets/data/crypto.json')
      .error(new ProgressEvent('offline'));

    expect(await pending).toEqual([]);
  });
});
