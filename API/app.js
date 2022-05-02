const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

let bd = {};

request(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=REDACTED-COINMARKETCAP-KEY', { json: true },
    (err, res, body) => {
        bd = body;
    }
);

app.get('/currency', (req, res) => {
    res.json(bd);
});

app.listen(8000);