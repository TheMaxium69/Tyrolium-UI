import { Routes } from '@angular/router';
import { TyroUiNotFound } from 'tyrolium-ui';

import { Home }                from './pages/home/home';
import { NavbarPage }          from './pages/components/navbar/navbar-page';
import { DashboardLayoutPage } from './pages/components/dashboard-layout/dashboard-layout-page';

export const routes: Routes = [
  { path: '',                            component: Home },
  { path: 'components/navbar',           component: NavbarPage },
  { path: 'components/dashboard-layout', component: DashboardLayoutPage },
  { path: '**',                          component: TyroUiNotFound },
];
