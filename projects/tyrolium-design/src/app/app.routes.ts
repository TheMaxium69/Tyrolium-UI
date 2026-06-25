import { Routes } from '@angular/router';
import { TyroUiForbidden, TyroUiNotFound } from 'tyrolium-ui';

import { Layout }              from './layout/layout';
import { PublicLayout }        from './public-layout/public-layout';

import { Home }                from './pages/home/home';

import { NavbarPage }          from './pages/showcase/navbar/navbar-page';
import { SubnavPage }          from './pages/showcase/subnav/subnav-page';
import { FooterPage }          from './pages/showcase/footer/footer-page';
import { CtaPage }             from './pages/showcase/cta/cta-page';

import { DashboardLayoutPage } from './pages/dashboard/dashboard-layout/dashboard-layout-page';
import { ButtonBentoPage }     from './pages/dashboard/button-bento/button-bento-page';
import { PageHeaderPage }      from './pages/dashboard/page-header/page-header-page';
import { BentoCardPage }       from './pages/dashboard/bento-card/bento-card-page';
import { DataTablePage }       from './pages/dashboard/data-table/data-table-page';
import { ChipPage }           from './pages/dashboard/chip/chip-page';
import { ButtonPage }         from './pages/dashboard/button/button-page';
import { ButtonGroupPage }    from './pages/dashboard/button-group/button-group-page';
import { SwitchPage }         from './pages/dashboard/switch/switch-page';
import { SelectPage }         from './pages/dashboard/select/select-page';
import { TextFieldPage }      from './pages/dashboard/text-field/text-field-page';
import { AlertPage }          from './pages/dashboard/alert/alert-page';
import { CheckboxPage }       from './pages/dashboard/checkbox/checkbox-page';
import { ProgressBarPage }    from './pages/dashboard/progress-bar/progress-bar-page';
import { SnackbarPage }       from './pages/dashboard/snackbar/snackbar-page';

import { AuthModalPage }       from './pages/modal/auth-modal/auth-modal-page';

import { NotFoundPage }        from './pages/page/not-found/not-found-page';
import { ForbiddenPage }       from './pages/page/forbidden/forbidden-page';
import { EasterEggPage }       from './pages/other/easter-egg/easter-egg-page';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '',                            component: Home },

      { path: 'showcase/navbar',             component: NavbarPage },
      { path: 'showcase/subnav',             component: SubnavPage },
      { path: 'showcase/footer',             component: FooterPage },
      { path: 'showcase/cta',               component: CtaPage },

      { path: 'dashboard/dashboard-layout', component: DashboardLayoutPage },
      { path: 'dashboard/button-bento',     component: ButtonBentoPage },
      { path: 'dashboard/page-header',      component: PageHeaderPage },
      { path: 'dashboard/bento-card',       component: BentoCardPage },
      { path: 'dashboard/data-table',       component: DataTablePage },
      { path: 'dashboard/chip',             component: ChipPage },
      { path: 'dashboard/button',           component: ButtonPage },
      { path: 'dashboard/button-group',     component: ButtonGroupPage },
      { path: 'dashboard/switch',           component: SwitchPage },
      { path: 'dashboard/select',           component: SelectPage },
      { path: 'dashboard/text-field',       component: TextFieldPage },
      { path: 'dashboard/alert',            component: AlertPage },
      { path: 'dashboard/checkbox',         component: CheckboxPage },
      { path: 'dashboard/progress-bar',     component: ProgressBarPage },
      { path: 'dashboard/snackbar',         component: SnackbarPage },

      { path: 'modal/auth-modal',           component: AuthModalPage },

      { path: 'page/not-found',             component: NotFoundPage },
      { path: 'page/forbidden',             component: ForbiddenPage },

      { path: 'other/easter-egg',           component: EasterEggPage },
    ],
  },

  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '403', component: TyroUiForbidden },
      { path: '**',  component: TyroUiNotFound  },
    ],
  },
];
