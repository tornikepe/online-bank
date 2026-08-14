# Online Bank

A banking dashboard built with Angular — accounts and cards, money transfers,
invoicing, spending reports, live currency rates and account settings. It runs
entirely on your machine against a local mock API, so there is nothing to sign up
for and no keys to configure.

Originally written in 2021 on Angular 13, and rebuilt in 2026 on Angular 22.
The [modernisation](#modernisation-2021--2026) section below is the interesting part.

```
Angular 22 · TypeScript 6 · RxJS 7 · SCSS · Vitest · json-server
```

---

## What it does

| Screen | |
| --- | --- |
| **Dashboard** | Income and expense trends, average income per month, card summary and a recent activity feed |
| **Transactions** | Full history with free-text search and filters by type and month |
| **Accounts** | Cards, deposits and loans with balances, rates and end dates; open a new card |
| **Payments** | Three transfer flows — bank transfer, electronic payment and transfer between your own accounts — with balance and beneficiary validation |
| **Reports** | Income against expenses, spending split by account type, and expenses by category |
| **Currency** | Live exchange rates from the National Bank of Georgia, plus a cryptocurrency listing |
| **Invoices** | Issue invoices from templates, filter by status and period, track what has been paid |
| **Settings** | Profile, password and security questions, payment limits, notification preferences |
| **News** | A financial news feed |

## Running it

You need **Node.js 22.22+, 24.15+ or 26+**.

```bash
npm install
```

Start the mock API and the app in two terminals:

```bash
npm run api
```

```bash
npm start
```

The app is served at <http://localhost:4200> and the API at <http://localhost:3000>.

### Signing in

Every account in the demo data uses the same password: **`Demo1234!`**

| Email | What it shows |
| --- | --- |
| `tornike.peitrishvili@example.com` | The fullest account — cards, deposits, loans, transfers |
| `main.user@example.com` | The counterparty used by the transfer flows |
| `mariam.tsiklauri@example.com` | The account that owns the sample invoices |

The data is fictional and lives in `db.json`, which the app writes to as you use
it. `git checkout db.json` puts the demo back to its starting state.

## Other commands

| | |
| --- | --- |
| `npm run build` | Production build into `dist/` |
| `npm test` | Unit tests (Vitest) |
| `npm run watch` | Rebuild on change |

## How it is put together

```
src/app
├── auth/          sign-in, sign-up, password recovery
├── features/      accounts, payments, transactions, invoices, reports,
│                  currency, news, settings, dashboard
├── guard/         route guards
├── interceptors/  bearer-token interceptor and token storage
├── layout/        sidebar, topbar, main shell
├── models/        API record types
├── services/      API and current-user services
├── shared/        buttons, inputs, tabs, pagination, datepickers, pipes
└── testing/       shared test setup
```

A few decisions worth calling out:

- **Routes are guarded, not just hidden.** `authGuard` protects the whole
  signed-in shell and remembers where you were headed, so signing in returns you
  there. `guestGuard` keeps a signed-in user off the sign-in screen.
- **One interceptor owns the token.** It attaches the bearer token to requests
  aimed at our own API and nothing else — sending it to third-party hosts meant
  their 401s were signing the user out.
- **The user id is read synchronously.** It is written at sign-in and survives a
  reload, so services filtering data by user never race the profile request.
- **No secrets in the repository.** `src/environments/` holds an API base URL and
  optional feed keys, all blank by default. A feature whose key is blank serves
  the bundled sample data in `src/assets/data/` instead of calling out, so the
  app is fully usable with no third-party account.

## Configuration

`src/environments/environment.ts` is committed, so **nothing secret belongs in
it**. To point the app at a deployed API, change `BaseUrl`. To use live news or
crypto feeds, fill in their `url` and `apiKey`; leave them blank to keep the
bundled data.

`API/app.js` is an optional proxy for live CoinMarketCap listings. It reads its
key from the environment and refuses to start without one:

```bash
CMC_API_KEY=your-key node API/app.js
```

## Modernisation (2021 → 2026)

The project sat untouched for four years. Bringing it back was less about new
features than about the things that quietly rot: an unsupported framework, dead
third-party services, credentials in source control, and data that no longer
matched the code reading it.

| | Before | After |
| --- | --- | --- |
| Angular | 13.1 (support ended 2023) | 22.1 |
| Build | webpack | esbuild (`@angular/build:application`) |
| Bundle, transferred | 265 kB | 86 kB |
| Tests running | 0 of 32 | 33 of 33 |
| npm vulnerabilities, runtime deps | 144 (7 critical) | 0 |
| Hardcoded API keys | 5 | 0 |
| CDN references for fonts, icons and styles | 22 | 0 |

**Framework.** Rather than nine sequential `ng update` hops — the first five of
which will not even run on a current Node — the build and configuration layer
was replaced with Angular 22's and the source ported in place. Two Angular 22
behaviours did most of the damage: `ApplicationRef.tick()` no longer checks every
component, so state assigned inside a `subscribe()` callback needs an explicit
`markForCheck()`; and `provideHttpClient()` now defaults to a fetch backend that
runs outside the Angular zone, so responses never woke change detection at all.

**Security.** The route guard existed but was not attached to the signed-in
shell, and the HTTP interceptor never sent a token because the service it
depended on was declared and never assigned. Five API keys sat in source. The
committed database held eighteen real email addresses and their password hashes.

**Correctness.** Transfers concatenated balances instead of adding them —
crediting 100 to a balance of `"156300"` produced `"156300100"` — because some
balances were stored as strings. User ids were numbers in some records and
strings in others, so strict comparisons silently dropped rows. Timestamps were
built by slicing fixed offsets out of a locale string, which swallowed the
leading hour digit whenever the month or day was a single character.

**Dead weight.** Three of the four external data sources had shut down or
revoked their keys; the news and crypto screens now fall back to bundled sample
data. Seven unused dependencies, a duplicate NgModule, an unreferenced component
and two committed zip archives were removed. Fonts and icon sets are bundled
rather than pulled from a CDN at runtime.

The two remaining `npm audit` findings are both in `json-server-auth`, the local
mock backend, and have no published fix. Nothing it depends on ships to
production.

## About the author

**Tornike Peitrishvili** — [github.com/tornikepe](https://github.com/tornikepe)

I build web applications and automation, and I like taking a project apart to
understand why it behaves the way it does. This repository is a good example: the
interesting work was not writing new screens, it was tracing a blank panel back
through a change-detection default, a fetch backend and four-year-old data to
find out which of the three was actually at fault.

Currently focused on front-end development with Angular, and on test automation
with Playwright and TypeScript.

<!-- Replace this paragraph with your own summary — what you are looking for,
     what you have shipped, and how to reach you. -->

## Licence

Released for portfolio and educational use.
