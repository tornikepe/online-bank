import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';
import { demoDataInterceptor } from './demo-data.interceptor';

/*
 * The interceptor only takes over in the deployed build, so each test flips
 * `production` for its duration and restores it afterwards.
 */
describe('demoDataInterceptor', () => {
  const wasProduction = environment.production;
  let http: HttpClient;

  beforeEach(() => {
    localStorage.clear();
    (environment as { production: boolean }).production = true;

    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([demoDataInterceptor]))],
    });
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    (environment as { production: boolean }).production = wasProduction;
    localStorage.clear();
  });

  const url = (path: string) => `${environment.BaseUrl}${path}`;

  it('serves a collection from the bundled seed', async () => {
    const cards = await firstValueFrom(http.get<any[]>(url('cards')));
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].account).toBeDefined();
  });

  it('filters a collection by a query parameter', async () => {
    const mine = await firstValueFrom(http.get<any[]>(url('cards?userId=11')));
    expect(mine.length).toBeGreaterThan(0);
    expect(mine.every(card => String(card.userId) === '11')).toBe(true);
  });

  /* The deployed serverless function kept its data in memory per instance, so a
     balance written by one request could be missing from the next read. State
     held in the browser has to survive across requests. */
  it('keeps a write visible to later reads', async () => {
    const before = await firstValueFrom(http.get<any[]>(url('deposits')));

    await firstValueFrom(
      http.post(url('deposits'), { name: 'Test deposit', balance: 10, userId: 11 })
    );

    const after = await firstValueFrom(http.get<any[]>(url('deposits')));
    expect(after.length).toBe(before.length + 1);
    expect(after.at(-1)!.name).toBe('Test deposit');
    expect(after.at(-1)!.id).toBeDefined();
  });

  it('applies a patch and returns the merged record', async () => {
    const [card] = await firstValueFrom(http.get<any[]>(url('cards')));

    const patched = await firstValueFrom<any>(
      http.patch(url(`cards/${card.id}`), { amount: 4242 })
    );

    expect(patched.amount).toBe(4242);
    expect(patched.account).toBe(card.account);

    const reread = await firstValueFrom<any>(http.get(url(`cards/${card.id}`)));
    expect(reread.amount).toBe(4242);
  });

  it('removes a deleted record', async () => {
    const before = await firstValueFrom(http.get<any[]>(url('deposits')));

    await firstValueFrom(http.delete(url(`deposits/${before[0].id}`)));

    const after = await firstValueFrom(http.get<any[]>(url('deposits')));
    expect(after.length).toBe(before.length - 1);
  });

  /* Sign-in checks a bcrypt hash, which stays on the server. */
  it('leaves the auth endpoints to the network', async () => {
    let reachedNetwork = false;
    TestBed.resetTestingModule();
    (environment as { production: boolean }).production = true;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            demoDataInterceptor,
            (req, next) => { reachedNetwork = true; return next(req); },
          ])
        ),
      ],
    });

    const client = TestBed.inject(HttpClient);
    await firstValueFrom(client.post(url('login'), {})).catch(() => undefined);

    expect(reachedNetwork).toBe(true);
  });
});
