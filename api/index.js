/*
 * Demo API for the deployed build.
 *
 * Locally the app talks to json-server, which keeps its data in db.json. A
 * serverless platform has no writable filesystem and no long-lived process, so
 * this provides the same REST surface backed by an in-memory copy of the seed
 * data: reads always work, and writes last as long as the instance stays warm.
 * That is the right trade-off for a public demo — anyone can move money around
 * without their changes leaking into someone else's session for good.
 */
const bcrypt = require('bcryptjs');
const seed = require('../db.json');

/** Cloned per instance so one visitor's writes cannot corrupt the seed. */
let db = null;

function database() {
  if (!db) {
    db = JSON.parse(JSON.stringify(seed));
  }
  return db;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body !== undefined && req.body !== null) {
      resolve(typeof req.body === 'string' ? safeParse(req.body) : req.body);
      return;
    }
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => resolve(safeParse(raw)));
  });
}

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** json-server compares loosely and coerces numeric strings; match that. */
function matches(record, filters) {
  return Object.entries(filters).every(([key, value]) => {
    /* json-server's paging params, and the segment Vercel adds when routing. */
    if (['_limit', '_page', '_sort', '_order', '__p'].includes(key)) return true;
    const actual = record[key];
    if (actual === undefined) return false;
    return String(actual) === String(value);
  });
}

function nextId(collection) {
  return collection.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
}

function withoutPassword(user) {
  const { password, ...rest } = user;
  return rest;
}

/* The client only stores this and sends it back as a bearer token; nothing on
   the demo API depends on its contents. */
function issueToken(user) {
  return Buffer.from(`${user.id}:${Date.now()}`).toString('base64url');
}


/* --- financial news ---------------------------------------------------------
 *
 * The original build read RapidAPI's "free-news" with the key in the bundle.
 * That service is retired and its key revoked, so the page fell back to a
 * snapshot committed under assets/ and the headlines never changed.
 *
 * Publisher RSS is free and needs no key, but browsers cannot read it: the
 * feeds send no CORS header. Fetching it here sidesteps that, keeps the browser
 * talking only to this origin, and lets one fetch serve every visitor.
 */
/* One set per tab, so the three read differently rather than repeating one
   feed three times. BBC carries a thumbnail on every item; CNBC carries none
   but goes deeper on markets, so each tab pairs one of each. */
const NEWS_FEEDS = {
  latest: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://www.cnbc.com/id/10000664/device/rss/rss.html',
  ],
  trending: [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://www.cnbc.com/id/20910258/device/rss/rss.html',
  ],
  popular: [
    'https://feeds.bbci.co.uk/news/business/economy/rss.xml',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  ],
};

/** Ten minutes is well inside how often these feeds actually change. */
const NEWS_TTL_MS = 10 * 60 * 1000;
const newsCache = new Map();

function firstTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? m[1] : '';
}

/** Unwraps CDATA, decodes the handful of entities RSS actually uses, trims tags. */
function clean(value) {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** RSS dates are RFC 822; the page prints "YYYY-MM-DD HH:mm:ss". */
function formatDate(raw) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

/** Feeds put the image in one of several places, or nowhere at all. */
function extractImage(item) {
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["']/i,
    /<image[^>]*>\s*<url>([^<]+)<\/url>/i,
  ];
  for (const re of patterns) {
    const m = item.match(re);
    if (m) return m[1];
  }
  const inline = item.match(/<img[^>]+src=["']([^"']+)["']/i);
  return inline ? inline[1] : '';
}

function parseFeed(xml) {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  return items
    .map((item) => ({
      title: clean(firstTag(item, 'title')),
      published_date: formatDate(clean(firstTag(item, 'pubDate'))),
      summary: clean(firstTag(item, 'description')).slice(0, 400),
      media: extractImage(item),
      link: clean(firstTag(item, 'link')),
    }))
    .filter((a) => a.title);
}

async function fetchNews(topic) {
  const feeds = NEWS_FEEDS[topic] || NEWS_FEEDS.latest;
  const cached = newsCache.get(topic) || { at: 0, articles: null };
  const now = Date.now();
  if (cached.articles && now - cached.at < NEWS_TTL_MS) {
    return cached.articles;
  }

  const collected = [];
  for (const feed of feeds) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(feed, {
        signal: controller.signal,
        headers: { 'User-Agent': 'online-bank-demo/1.0' },
      });
      clearTimeout(timer);
      if (!response.ok) continue;
      collected.push(...parseFeed(await response.text()));
    } catch {
      /* One feed being slow or down must not empty the page. */
    }
  }

  if (!collected.length) {
    /* Serve the last good result rather than an empty page. */
    return cached.articles || [];
  }

  /* Newest first, and drop the duplicates the two feeds share. */
  const seen = new Set();
  const articles = collected
    .filter((a) => !seen.has(a.title) && seen.add(a.title))
    .sort((a, b) => b.published_date.localeCompare(a.published_date))
    .slice(0, 30);

  newsCache.set(topic, { at: now, articles });
  return articles;
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  /* The host rewrites /api/<rest> to this handler and passes <rest> as `__p`,
     so routing never depends on how the platform reshapes the path. Falls back
     to the URL when running directly, as the local preview does. */
  const routed = url.searchParams.get('__p');
  const raw = routed !== null ? routed : url.pathname.replace(/^\/api\/?/, '');
  const segments = raw.split('/').filter(Boolean);
  const data = database();

  if (req.method === 'OPTIONS') {
    return send(res, 204);
  }

  // --- auth -----------------------------------------------------------------
  if (segments[0] === 'login' && req.method === 'POST') {
    const { email, password } = await readBody(req);
    const user = data.users.find((u) => u.email === email);
    if (!user) return send(res, 400, 'Cannot find user');
    if (!bcrypt.compareSync(String(password || ''), user.password)) {
      return send(res, 400, 'Incorrect password');
    }
    return send(res, 200, { accessToken: issueToken(user), user: withoutPassword(user) });
  }

  if (segments[0] === 'news' && req.method === 'GET') {
    const topic = url.searchParams.get('topic') || 'latest';
    const articles = await fetchNews(topic);
    return send(res, 200, { status: 'ok', topic, articles });
  }

  if (segments[0] === 'register' && req.method === 'POST') {
    const body = await readBody(req);
    if (!body.email || !body.password) return send(res, 400, 'Email and password are required');
    if (data.users.some((u) => u.email === body.email)) {
      return send(res, 400, 'Email already exists');
    }
    const user = {
      ...body,
      password: bcrypt.hashSync(String(body.password), 10),
      id: nextId(data.users),
    };
    data.users.push(user);
    return send(res, 201, { accessToken: issueToken(user), user: withoutPassword(user) });
  }

  // --- collections ----------------------------------------------------------
  const [name, id] = segments;
  const collection = data[name];
  if (!Array.isArray(collection)) return send(res, 404, {});

  const strip = name === 'users' ? withoutPassword : (row) => row;

  if (!id) {
    if (req.method === 'GET') {
      const filters = Object.fromEntries(url.searchParams.entries());
      return send(res, 200, collection.filter((row) => matches(row, filters)).map(strip));
    }
    if (req.method === 'POST') {
      const created = { ...(await readBody(req)), id: nextId(collection) };
      collection.push(created);
      return send(res, 201, strip(created));
    }
    return send(res, 405, {});
  }

  const index = collection.findIndex((row) => String(row.id) === String(id));
  if (index === -1) return send(res, 404, {});

  if (req.method === 'GET') return send(res, 200, strip(collection[index]));

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const body = await readBody(req);
    const base = req.method === 'PUT' ? { id: collection[index].id } : collection[index];
    collection[index] = { ...base, ...body, id: collection[index].id };
    return send(res, 200, strip(collection[index]));
  }

  if (req.method === 'DELETE') {
    collection.splice(index, 1);
    return send(res, 200, {});
  }

  return send(res, 405, {});
};
