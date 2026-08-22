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
    if (['_limit', '_page', '_sort', '_order', 'path'].includes(key)) return true;
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

module.exports = async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const segments = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
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
