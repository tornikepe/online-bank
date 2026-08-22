import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import seed from '../../../db.json';

/*
 * Serves the demo API out of the visitor's own browser.
 *
 * The deployed build has no database. The bundled serverless function keeps its
 * copy of the data in memory, which works until the platform spreads requests
 * across instances: a transfer could land on one instance and the next read on
 * another, so a balance updated a moment ago appeared to snap back. Anything
 * that only reads is fine that way, but the whole point of the demo is that you
 * can move money around and watch it happen.
 *
 * Keeping the mutable copy in localStorage removes the problem entirely. Every
 * visitor gets their own bank, seeded from the same data the local json-server
 * uses, and it survives a reload. Sign-in still goes to the server, which is
 * where the password hashes are checked.
 */

const STORE_KEY = 'online-bank-demo-db-v1';

/** Bumping this discards a store seeded from older demo data. */
const SEED_VERSION_KEY = 'online-bank-demo-db-seed';
const SEED_VERSION = '2026-08-22';

type Collection = Record<string, any>[];
type Database = Record<string, Collection>;

/** json-server's paging and sorting params are not record fields. */
const RESERVED_PARAMS = ['_limit', '_page', '_sort', '_order', '__p'];

function loadDatabase(): Database {
  try {
    if (localStorage.getItem(SEED_VERSION_KEY) === SEED_VERSION) {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored) return JSON.parse(stored);
    }
  } catch {
    /* Private browsing, a full quota or hand-edited JSON — reseed below. */
  }
  const fresh = structuredClone(seed) as unknown as Database;
  saveDatabase(fresh);
  return fresh;
}

function saveDatabase(db: Database): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(db));
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  } catch {
    /* Out of quota: the session still works, it just will not survive a reload. */
  }
}

/** Splits "/api/cards/3?userId=11" into its collection, id and filters. */
function parse(url: string): { collection: string; id: string | null; filters: [string, string][] } {
  const [path, query = ''] = url.slice(environment.BaseUrl.length).split('?');
  const [collection, id] = path.split('/').filter(Boolean);
  const filters = [...new URLSearchParams(query).entries()].filter(
    ([key]) => !RESERVED_PARAMS.includes(key)
  );
  return { collection, id: id ?? null, filters };
}

/** json-server compares loosely and coerces numeric strings; match that. */
function satisfies(record: Record<string, any>, filters: [string, string][]): boolean {
  return filters.every(([key, value]) => String(record[key]) === String(value));
}

function nextId(rows: Collection): number {
  return rows.reduce((highest, row) => Math.max(highest, Number(row['id']) || 0), 0) + 1;
}

function ok(body: unknown, status = 200): Observable<HttpResponse<unknown>> {
  /* A tick of latency keeps the loading states in the UI meaningful. */
  return of(new HttpResponse({ status, body })).pipe(delay(80));
}

export const demoDataInterceptor: HttpInterceptorFn = (req, next) => {
  const handledHere =
    environment.production &&
    req.url.startsWith(environment.BaseUrl) &&
    !/\/(login|register)\/?$/.test(req.url.split('?')[0]);

  if (!handledHere) {
    return next(req);
  }

  const db = loadDatabase();
  const { collection, id, filters } = parse(req.url);
  const rows = db[collection];

  if (!rows) {
    return throwError(
      () => new HttpResponse({ status: 404, body: { message: 'Not found' } })
    );
  }

  const indexOf = (wanted: string) =>
    rows.findIndex((row) => String(row['id']) === String(wanted));

  switch (req.method) {
    case 'GET': {
      if (id !== null) {
        const found = rows[indexOf(id)];
        return found ? ok(found) : ok({ message: 'Not found' }, 404);
      }
      return ok(rows.filter((row) => satisfies(row, filters)));
    }

    case 'POST': {
      const created = { ...(req.body as object), id: nextId(rows) };
      rows.push(created);
      saveDatabase(db);
      return ok(created, 201);
    }

    case 'PATCH':
    case 'PUT': {
      if (id === null) return ok({ message: 'Not found' }, 404);
      const at = indexOf(id);
      if (at < 0) return ok({ message: 'Not found' }, 404);
      rows[at] =
        req.method === 'PATCH'
          ? { ...rows[at], ...(req.body as object) }
          : { ...(req.body as object), id: rows[at]['id'] };
      saveDatabase(db);
      return ok(rows[at]);
    }

    case 'DELETE': {
      if (id === null) return ok({ message: 'Not found' }, 404);
      const at = indexOf(id);
      if (at < 0) return ok({ message: 'Not found' }, 404);
      const [removed] = rows.splice(at, 1);
      saveDatabase(db);
      return ok(removed);
    }

    default:
      return next(req);
  }
};
