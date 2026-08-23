/*
 * No secrets belong in this file — it is committed to the repository. Supply real
 * values through your deployment's build step; the news key is optional — left
 * blank, the page reads publisher RSS through this app's own /api/news.
 */
export const environment = {
  production: true,
  /* Served by the bundled serverless demo API — see api/. */
  BaseUrl: '/api/',

  /* Optional keyed news API. Left blank, the page reads publisher RSS through
     this app's own `GET /api/news`, which needs no credentials. */
  news: {
    url: '',
    apiKey: '',
  },
};
