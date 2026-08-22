import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from "@angular/common/http";

import { AppModule } from "./app.module";
import { authInterceptor } from "./interceptors/auth-interceptor.service";
import { demoDataInterceptor } from "./interceptors/demo-data.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    /* `provideHttpClient` defaults to the fetch backend in v22, and that backend
       issues its requests inside `runOutsideAngular` — so responses never wake up
       zone change detection. The XHR backend stays inside the Angular zone. */
    /* `demoDataInterceptor` is inert outside the deployed build; there it serves
       the data API from the visitor's own browser so their writes stick. */
    provideHttpClient(
      withXhr(),
      withInterceptors([authInterceptor, demoDataInterceptor])
    ),
    /* Brings in the routes, the auth screens and the shared/layout NgModule scopes. */
    importProvidersFrom(AppModule),
    /* Components still assign state inside subscribe() callbacks, so zone change
       detection stays on until they are migrated to signals. */
    provideZoneChangeDetection(),
  ],
};
