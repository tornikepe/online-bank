/*
 * No secrets belong in this file — it is committed to the repository. Supply real
 * values through your deployment's build step; a feature whose key is blank falls
 * back to bundled demo data instead of calling the third-party service.
 */
export const environment = {
  production: true,
  /* Served by the bundled serverless demo API — see api/. */
  BaseUrl: '/api/',

  /* Financial news feed. */
  news: {
    url: '',
    apiKey: '',
  },

  /* Cryptocurrency listings shown on the Currency page. */
  crypto: {
    url: '',
    apiKey: '',
  },
};
