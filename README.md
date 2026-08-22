# Online Bank

A complete online banking application — accounts and cards, money transfers,
invoicing, spending reports, live exchange rates and account settings. Nine
screens, all of them working, running against a demo API that needs no signup,
no keys and no database.

```
Angular 22 · TypeScript · RxJS · SCSS · ApexCharts · Vitest
```

<!-- Live demo: add the deployment URL here once it is published. -->

---

## Contents

- [What is in it](#what-is-in-it)
- [Try it in five minutes](#try-it-in-five-minutes)
- [Signing in](#signing-in)
- [How it is built](#how-it-is-built)
- [The API](#the-api)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Design notes](#design-notes)
- [About the author](#about-the-author)

---

## What is in it

### Dashboard
The landing screen after sign-in. An income and expenses trend you can switch
between monthly, weekly and daily; average income per month broken down by cards
or accounts; your cards with live balances; and a recent activity feed.

### Transactions
Every transaction on the account, with free-text search across descriptions and
filters by type and by month. Tapping a row opens the full detail. The list
pages in as you scroll.

### Accounts
Everything you hold, in three sections. **Cards** with balance, blocked amount,
expiry and status. **Deposits** with balance, accrued interest, rate and end
date. **Credits** with the original amount, how much is repaid and the rate.
Three summary tiles at the top total the cards, deposits and outstanding credit.
You can open a new card from here, and each row leads to a detail page with its
own chart.

### Payments
Three transfer flows, each with its own form:

| | |
| --- | --- |
| **Bank transfer** | To any account, with a beneficiary name and a currency choice |
| **Electronic payment** | To PayPal, Skrill or Payoneer, with the fee shown before you send |
| **Transfer to my account** | Between your own cards |

Every transfer validates that the source account holds enough, that the
destination exists, and that the beneficiary name matches the account before it
moves any money. Both balances update and the transaction appears in the history.

### Reports
Income against expenses over recent months, switchable between an overall view
and cards or deposits alone; spending split across debit cards, credit cards and
cash; and expenses by category as a donut.

### Currency
Live exchange rates from the National Bank of Georgia, refreshed on load, with
each currency's daily change. A second tab lists cryptocurrencies with price,
market cap, volume and 24-hour and 7-day movement, and a search box to filter
them.

### Invoices
Issue an invoice from a template, then track it. Filter by status — all, paid,
pending, cancelled — and by month and year. A running total of what has been
paid sits alongside.

### Settings
Four sections: **general information** (name, email, phone, language),
**security** (change password, security questions), **payment limits** (cash
withdrawals, bank transactions, online payments, each against current spend) and
**notifications**.

### News
A financial news feed with latest, trending and most popular tabs.

### Everywhere
Sign-in, sign-up and password recovery; a notification centre in the top bar;
route guards that keep the signed-in area private and return you to the page you
asked for; and a layout that works from a phone up.

---

## Try it in five minutes

You need **Node.js 22.22+, 24.15+ or 26+**.

```bash
git clone https://github.com/tornikepe/online-bank.git
cd online-bank
npm install
```

Then start the API and the app in two terminals:

```bash
npm run api
```

```bash
npm start
```

Open <http://localhost:4200> and sign in with the details below.

## Signing in

Every demo account uses the same password: **`Demo1234!`**

| Email | What it shows |
| --- | --- |
| `tornike.peitrishvili@example.com` | The fullest account — cards, deposits, loans, transfers, invoices |
| `main.user@example.com` | The counterparty the transfer flows pay into |
| `mariam.tsiklauri@example.com` | A quieter account, useful for comparing |

You can also register a new account from the sign-up screen; it starts empty.

The data is fictional and lives in `db.json`, which the app writes to as you use
it. To reset the demo:

```bash
git checkout db.json
```

## How it is built

```
src/app
├── auth/          sign-in, sign-up, password recovery
├── features/      accounts, payments, transactions, invoices, reports,
│                  currency, news, settings, dashboard
├── guard/         route guards
├── interceptors/  bearer-token interceptor and token storage
├── layout/        sidebar, topbar, main shell, footer
├── models/        the shapes the API returns
├── services/      API and current-user services
├── shared/        buttons, inputs, dropdowns, tabs, pagination, datepickers,
│                  toasts, pipes
└── testing/       shared test setup

api/               serverless demo API used by the deployed build
src/assets/data/   bundled sample feeds for news and crypto
db.json            the demo database
```

Feature areas are lazy-loaded, so the initial download stays small — around
86 kB transferred — and each screen arrives when you first visit it.

## The API

Locally the app talks to [json-server](https://github.com/typicode/json-server)
with [json-server-auth](https://github.com/jeremyben/json-server-auth) on top,
started by `npm run api`. It serves `db.json` at `http://localhost:3000` and
writes changes back to the file.

| Method | Path | |
| --- | --- | --- |
| `POST` | `/login` | Returns an access token and the user |
| `POST` | `/register` | Creates an account |
| `GET` | `/{collection}` | Lists records; supports `?field=value` filters |
| `GET` | `/{collection}/{id}` | One record |
| `POST` | `/{collection}` | Creates a record |
| `PUT` `PATCH` | `/{collection}/{id}` | Replaces or updates a record |
| `DELETE` | `/{collection}/{id}` | Removes a record |

Collections: `users`, `cards`, `deposits`, `loans`, `transactions`, `invoices`,
`paymentTypes`, `income`, `expenses`, `spending`, `spendings`,
`expenseCategories`, `limits`, `notifications`, `userNotifications`,
`moneytransfer`, `charts`, `cardTypes`.

The deployed build uses the small serverless equivalent in `api/`, which offers
the same surface from an in-memory copy of `db.json` — see
[Deployment](#deployment).

## Configuration

`src/environments/environment.ts` holds the API base URL and optional keys for
the news and crypto feeds. **It is committed, so nothing secret belongs in it.**

Both feeds ship with sample data in `src/assets/data/`, and each falls back to
that data whenever its key is blank — so every screen works without a
third-party account. Fill in a `url` and `apiKey` to switch a feed to live data.

`API/app.js` is an optional proxy for live CoinMarketCap listings. It reads its
key from the environment and refuses to start without one:

```bash
CMC_API_KEY=your-key node API/app.js
```

## Testing

```bash
npm test
```

33 tests across 31 files, run with Vitest through Angular's own test builder.
Each spec mounts its component inside the module that declares it, with the HTTP
and router test doubles wired up, so the tests exercise the real template rather
than a stub.

## Deployment

The repository is ready for Vercel as it stands — `vercel.json` sets the build
command, the output directory and a single-page-app fallback:

```bash
npx vercel --prod
```

Any static host works for the front end. The one thing to know is the API: a
serverless platform has no writable filesystem and no long-lived process, so
json-server cannot run there. `api/[[...path]].js` provides the same REST
surface from an in-memory copy of `db.json`. Reads always work and writes last
as long as the instance stays warm, which is what you want for a public demo —
visitors can move money around without permanently changing what the next
visitor sees.

To point the app at a real backend instead, set `BaseUrl` in
`src/environments/environment.prod.ts` and delete `api/`.

## Design notes

A few decisions that are worth knowing if you read the code:

- **Routes are guarded, not just hidden.** `authGuard` protects the whole
  signed-in shell and remembers where you were headed, so signing in returns you
  there. `guestGuard` keeps a signed-in user off the auth screens.
- **One interceptor owns the token.** It attaches the bearer token to requests
  aimed at our own API and nothing else — sending it to third-party hosts means
  their 401s sign the user out.
- **The user id is read synchronously.** It is written at sign-in and survives a
  reload, so services filtering data by user never race the profile request.
- **Change detection is explicit.** Angular 22 does not repaint a view just
  because a field changed, so anything assigned from an async callback marks its
  own view. The same rule applies to a parent writing to a child's input.
- **Money is coerced before arithmetic.** Balances arrive as both numbers and
  numeric strings, and `+` on a string concatenates.
- **The layout has a mobile path.** Below 900px the sidebar becomes a drawer,
  dense rows restack, and screens that genuinely need the width — the exchange
  rate table — scroll inside their own panel rather than the page.

## About the author

**Tornike Peitrishvili** — [github.com/tornikepe](https://github.com/tornikepe)

I build web applications and enjoy the part of the work where you take something
apart to find out why it really behaves the way it does, rather than guessing.

Currently working with Angular and TypeScript on the front end, and with
Playwright for test automation.

<!-- Add your own summary here: what you are looking for, what you have shipped,
     and the best way to reach you. -->

## Licence

Released for portfolio and educational use.
