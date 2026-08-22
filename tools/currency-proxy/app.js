/*
 * Optional helper backend.
 *
 * The original version fetched CoinMarketCap with the API key written directly
 * into the source, which then sat in this public repository. The key has to come
 * from the environment instead — the server refuses to start without it.
 *
 *   CMC_API_KEY=your-key node app.js
 *
 * The Angular app does not need this process: with `environment.crypto` left
 * blank it serves the bundled sample listing from assets/data/crypto.json.
 */
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = process.env.CMC_API_KEY;
const PORT = process.env.PORT || 8000;

if (!API_KEY) {
  console.error(
    'CMC_API_KEY is not set. Start with: CMC_API_KEY=your-key node app.js'
  );
  process.exit(1);
}

let cache = { data: [], fetchedAt: 0 };
const CACHE_TTL_MS = 60_000;

async function loadListings() {
  const res = await fetch(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    { headers: { 'X-CMC_PRO_API_KEY': API_KEY } }
  );

  if (!res.ok) {
    throw new Error(`CoinMarketCap responded ${res.status}`);
  }

  return res.json();
}

app.get('/currency', async (req, res) => {
  try {
    if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) {
      cache = { data: await loadListings(), fetchedAt: Date.now() };
    }
    res.json(cache.data);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach the listings provider.' });
  }
});

app.listen(PORT, () => {
  console.log(`Currency proxy listening on http://localhost:${PORT}`);
});
