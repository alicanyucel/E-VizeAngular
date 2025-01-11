// Angular modules
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/layout.module').then((m) => m.LayoutModule),
  },
];
