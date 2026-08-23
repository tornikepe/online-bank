# Online Bank

A complete online banking application — accounts and cards, money transfers,
invoicing, spending reports, live exchange rates and account settings. Nine
screens, all of them working, running against a demo API that needs no signup,
no keys and no database.

```
Angular 22 · TypeScript · RxJS · SCSS · ApexCharts · Vitest
```

**[Try the live demo →](https://online-bank-theta.vercel.app)**  
Sign in with `tornike.peitrishvili@example.com` / `Demo1234!`

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
each currency's daily change. A second tab lists the top cryptocurrencies live
from CoinGecko — price, market cap, volume, share of total volume and 24-hour
and 7-day movement — with a search box to filter them.

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
A live financial news feed with latest, trending and most popular tabs, each
drawing on its own pair of publisher feeds.

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
| `levan.chkhaidze@example.com` | The counterparty the transfer flows pay into |
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
tools/             optional CoinMarketCap proxy
src/assets/data/   offline fallbacks for the news and crypto feeds
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

In the deployed build the same surface is served from the visitor's own
browser, seeded from `db.json`; only sign-in goes to the network — see
[Deployment](#deployment).

## Configuration

`src/environments/environment.ts` holds the API base URL. **It is committed, so
nothing secret belongs in it** — and nothing secret is needed:

| Data | Source | Key |
| --- | --- | --- |
| Exchange rates | National Bank of Georgia | none |
| Crypto listings | CoinGecko public API | none |
| Headlines | Publisher RSS via this app's `GET /api/news` | none |

RSS is keyless but browsers cannot read it — the feeds send no CORS header — so
the news route fetches and reshapes it server-side, cached ten minutes per
topic. Each source falls back to a bundled sample in `src/assets/data/` if it is
unreachable, so no screen is ever empty.

The optional `news` block in the environment points that page at a keyed
third-party API instead, should you prefer one.

`tools/currency-proxy/app.js` remains as an optional CoinMarketCap proxy. It is
no longer used — CoinGecko needs no key — and refuses to start without one:

```bash
CMC_API_KEY=your-key node tools/currency-proxy/app.js
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

Live at **<https://online-bank-theta.vercel.app>**, deployed from `master`.

`vercel.json` sets the build command, the output directory, the single-page-app
fallback and the route that carries `/api/*` to the demo function:

```bash
npx vercel --prod
```

Any static host works for the front end. The one thing to know is the API: a
serverless platform has no writable filesystem and no long-lived process, so
json-server cannot run there.

The deployed build therefore serves the data API from the visitor's own
browser. `src/app/interceptors/demo-data.interceptor.ts` seeds a copy of
`db.json` into `localStorage` on first load and answers every subsequent read
and write from it. Each visitor gets their own bank: transfers, new cards and
new deposits persist across reloads and never touch anyone else's session. The
interceptor is inert outside the production build, where json-server handles
the same calls.

Two routes are the exception, and both are the server's job rather than demo
data. Sign-in compares a bcrypt hash, so `POST /api/login` and
`POST /api/register` go to `api/index.js`. `GET /api/news` lives there too: it
fetches publisher RSS, which browsers cannot read for want of a CORS header,
and reshapes it into the feed the page renders.

An earlier version routed everything through that function and kept the data in
memory. It worked until the platform spread requests across instances — a
transfer could land on one instance and the next read on another, so a balance
updated a moment ago appeared to snap back. Holding the mutable copy in the
browser removes the problem.

To point the app at a real backend instead, set `BaseUrl` in
`src/environments/environment.prod.ts`, delete `api/`, and drop
`demoDataInterceptor` from `src/app/app.config.ts`.

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

**Tornike Peitrishvili** — Tbilisi, Georgia · [github.com/tornikepe](https://github.com/tornikepe)

I build web applications, and the part I enjoy most is taking something apart to
find out why it actually behaves the way it does instead of guessing.

This project is a fair sample of that. It began as a four-year-old Angular 13
app that no longer built on a current Node, and the version bump turned out to
be the easy half. The rest was finding what had quietly broken and what had
never worked: a change-detection rule in Angular 22 that stops repainting a view
whose field was set from an async callback; a transfer that ran twice on one
click because the button was wired to both `(click)` and its form's `(ngSubmit)`;
a bank-transfer field capped at sixteen characters against a validator demanding
twenty-two, so the form could never be submitted at all; a report tab that
picked its series by array position and drew an empty chart the moment the data
was filtered. Typing the codebase — 210 `any` declarations down to none — turned
up eleven more, including two dashboard charts that threw on every mouse move
because they read a property Chrome removed in version 109.

**What I work with.** TypeScript and Angular on the front end, Node and Python
behind it. Recent work includes [bazari](https://github.com/tornikepe/bazari), a
bilingual storefront with faceted filtering, cart and an admin panel, and
[rag-knowledge-assistant](https://github.com/tornikepe/rag-knowledge-assistant),
a document chat built on FastAPI. I am working through Playwright, SQL and API
testing to round out the testing side.

**What I am looking for.** A front-end or full-stack role where the work involves
real products and real users, and where careful debugging is valued as much as
new features. Open to remote and to teams in Tbilisi.

The quickest way to reach me is through my
[GitHub profile](https://github.com/tornikepe).

## Licence

Released for portfolio and educational use.
