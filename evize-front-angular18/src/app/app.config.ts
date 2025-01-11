import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig,
} from "@angular/router";

import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { provideClientHydration } from "@angular/platform-browser";
import { routes } from "./app.routes";
import { SampleInterceptor } from "./shared/session.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: "reload",
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
      })
    ),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SampleInterceptor,
      multi: true
    }

  ],
};
