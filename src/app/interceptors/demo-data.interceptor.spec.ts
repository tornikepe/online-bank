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

  /* News is the one route the browser cannot serve: publisher RSS carries no
     CORS header, so that request has to reach the network. */
  it('leaves the news route to the network', async () => {
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
    await firstValueFrom(client.get(url('news'))).catch(() => undefined);

    expect(reachedNetwork).toBe(true);
  });

  /* An account created against the serverless function lived only in that
     instance's memory, so it stopped working when the instance recycled. */
  describe('registration', () => {
    const account = {
      email: 'someone@example.test',
      password: 'Str0ngPass!',
      Full_Name: 'Some One',
      Agree_Term: true,
    };

    it('creates an account that can sign in afterwards', async () => {
      const created = await firstValueFrom<any>(
        http.post(url('register'), account)
      );
      expect(created.accessToken).toBeTruthy();
      expect(created.user.email).toBe(account.email);

      const session = await firstValueFrom<any>(
        http.post(url('login'), { email: account.email, password: account.password })
      );
      expect(session.user.id).toBe(created.user.id);
    });

    it('never hands back the password', async () => {
      const created = await firstValueFrom<any>(
        http.post(url('register'), account)
      );
      expect(created.user.password).toBeUndefined();

      const session = await firstValueFrom<any>(
        http.post(url('login'), { email: account.email, password: account.password })
      );
      expect(session.user.password).toBeUndefined();
    });

    it('stores the password hashed rather than as typed', async () => {
      await firstValueFrom(http.post(url('register'), account));

      const users = await firstValueFrom(http.get<any[]>(url('users')));
      const stored = users.find((u: any) => u.email === account.email);
      expect(stored.password).toBeDefined();
      expect(stored.password).not.toBe(account.password);
    });

    it('turns away a duplicate email', async () => {
      await firstValueFrom(http.post(url('register'), account));
      const second = await firstValueFrom(
        http.post(url('register'), account)
      ).catch(() => 'rejected');
      expect(second).toBe('Email already exists');
    });

    it('turns away a wrong password', async () => {
      await firstValueFrom(http.post(url('register'), account));
      const attempt = await firstValueFrom(
        http.post(url('login'), { email: account.email, password: 'wrong' })
      );
      expect(attempt).toBe('Incorrect password');
    });

    /* The seeded demo account carries a bcrypt hash and must still work. */
    it('still signs in the seeded demo account', async () => {
      const session = await firstValueFrom<any>(
        http.post(url('login'), {
          email: 'tornike.peitrishvili@example.com',
          password: 'Demo1234!',
        })
      );
      expect(session.user.Full_Name).toBe('Tornike Peitrishvili');
    });
  });
});
