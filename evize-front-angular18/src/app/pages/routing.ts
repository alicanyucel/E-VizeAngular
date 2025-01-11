import { Routes } from "@angular/router";

const Routing: Routes = [
  {
    path: "verify/:token",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
    data: {
      returnUrl: typeof window !== "undefined" ? window?.location.pathname : "",
    },
  },
  {
    path: "contact",
    loadChildren: () =>
      import("./contact/contact.module").then((m) => m.ContactModule),
  },

  {
    path: "apply",
    loadChildren: () =>
      import("./apply/apply.module").then((m) => m.ApplyModule),
  },
  {
    path: "terms-and-conditions",
    loadChildren: () =>
      import("./terms-and-conditions/terms-and-conditions.module").then(
        (m) => m.TermsAndConditionsModule
      ),
  },
  {
    path: "privacy-policy",
    loadChildren: () =>
      import("./privacy-policy/privacy-policy.module").then(
        (m) => m.PrivacyPolicyModule
      ),
  },

  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "faq",
    loadChildren: () => import("./faq/faq.module").then((m) => m.FaqModule),
  },

  {
    path: "reset-password",
    loadChildren: () =>
      import("./reset-password/reset-password.module").then(
        (m) => m.ResetPasswordModule
      ),
  },

  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterModule),
    data: {
      returnUrl: typeof window !== "undefined" ? window?.location.pathname : "",
    },
  },
  {
    path: "**",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
];

export { Routing };
