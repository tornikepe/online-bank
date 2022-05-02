const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());

let bd = {};

request(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=bfbf3671-1d38-4c37-8b8a-e0179e729bca', { json: true },
    (err, res, body) => {
        bd = body;
    }
);

app.get('/currency', (req, res) => {
    res.json(bd);
});

app.listen(8000);