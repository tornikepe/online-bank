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

export const appConfig: ApplicationConfig = {
  providers: [
    /* `provideHttpClient` defaults to the fetch backend in v22, and that backend
       issues its requests inside `runOutsideAngular` — so responses never wake up
       zone change detection. The XHR backend stays inside the Angular zone. */
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    /* Brings in the routes, the auth screens and the shared/layout NgModule scopes. */
    importProvidersFrom(AppModule),
    /* Components still assign state inside subscribe() callbacks, so zone change
       detection stays on until they are migrated to signals. */
    provideZoneChangeDetection(),
  ],
};
