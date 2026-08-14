// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * No secrets belong in this file — it is committed to the repository. The keys
 * below are intentionally empty; a feature whose key is blank falls back to
 * bundled demo data instead of calling the third-party service.
 *
 * To use live data locally, copy this file's shape into a git-ignored
 * `environment.local.ts` or supply the keys through your own build step.
 */
export const environment = {
  production: false,
  BaseUrl: 'http://localhost:3000/',

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
