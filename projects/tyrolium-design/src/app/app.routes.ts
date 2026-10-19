import { Routes } from '@angular/router';
import { TyroUiSeo, tyroUiErrorRoutes, tyroUiLocalizedRoutes } from 'tyrolium-ui';

import { Layout }              from './layout/layout';
import { PublicLayout }        from './public-layout/public-layout';

import { Home }                from './pages/home/home';
import { TypoPage }            from './pages/typo/typo-page';

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
import { SkeletonPage }       from './pages/dashboard/skeleton/skeleton-page';
import { AvatarPage }         from './pages/dashboard/avatar/avatar-page';
import { AvatarGroupPage }    from './pages/dashboard/avatar-group/avatar-group-page';
import { UserChipPage }       from './pages/dashboard/user-chip/user-chip-page';
import { BarChartPage }       from './pages/dashboard/bar-chart/bar-chart-page';

import { ConfirmModalPage }   from './pages/modal/confirm-modal/confirm-modal-page';

import { AuthModalPage }       from './pages/modal/auth-modal/auth-modal-page';

import { NotFoundPage }        from './pages/page/not-found/not-found-page';
import { ForbiddenPage }       from './pages/page/forbidden/forbidden-page';
import { GonePage }            from './pages/page/gone/gone-page';
import { LoginPage }           from './pages/page/login/login-page';
import { AuthCardPage }        from './pages/page/auth-card/auth-card-page';
import { EasterEggPage }       from './pages/other/easter-egg/easter-egg-page';

/* ─── SEO ─────────────────────────────────────────────────────────────── */

const SEO_HOME: TyroUiSeo = {
  fullTitle:   { fr: 'Tyrolium - Design System', en: 'Tyrolium - Design System' },
  description: { fr: 'Tyrolium Design : la documentation du Design System Tyrolium UI. Typographie, couleurs et composants Angular partagés par tous les sites du groupe.', en: 'Tyrolium Design: the documentation of the Tyrolium UI Design System. Typography, colours and Angular components shared by every site of the group.' },
};

const SEO_TYPO: TyroUiSeo = {
  title:       { fr: 'Typographie & Couleurs', en: 'Typography & Colours' },
  description: { fr: 'Polices, échelle typographique et palette de couleurs du Design System Tyrolium.', en: 'Fonts, type scale and colour palette of the Tyrolium Design System.' },
};

/** SEO d'une page de documentation de composant */
const doc = (name: string): { seo: TyroUiSeo } => ({
  seo: {
    title:       { fr: name, en: name },
    description: {
      fr: `Documentation du composant ${name} de Tyrolium UI : aperçu, propriétés et exemples d'utilisation.`,
      en: `Documentation for the Tyrolium UI ${name} component: preview, properties and usage examples.`,
    },
  },
});

export const routes: Routes = tyroUiLocalizedRoutes([
  {
    path: '',
    component: Layout,
    children: [
      { path: '',                            component: Home, data: { seo: SEO_HOME } },
      { path: 'typo',                        component: TypoPage, data: { seo: SEO_TYPO } },

      { path: 'showcase/navbar',             component: NavbarPage, data: doc('Navbar') },
      { path: 'showcase/subnav',             component: SubnavPage, data: doc('Subnav') },
      { path: 'showcase/footer',             component: FooterPage, data: doc('Footer') },
      { path: 'showcase/cta',               component: CtaPage, data: doc('CTA') },

      { path: 'dashboard/dashboard-layout', component: DashboardLayoutPage, data: doc('Dashboard Layout') },
      { path: 'dashboard/button-bento',     component: ButtonBentoPage, data: doc('Button Bento') },
      { path: 'dashboard/page-header',      component: PageHeaderPage, data: doc('Page Header') },
      { path: 'dashboard/bento-card',       component: BentoCardPage, data: doc('Bento Card') },
      { path: 'dashboard/data-table',       component: DataTablePage, data: doc('Data Table') },
      { path: 'dashboard/chip',             component: ChipPage, data: doc('Chip') },
      { path: 'dashboard/button',           component: ButtonPage, data: doc('Button') },
      { path: 'dashboard/button-group',     component: ButtonGroupPage, data: doc('Button Group') },
      { path: 'dashboard/switch',           component: SwitchPage, data: doc('Switch') },
      { path: 'dashboard/select',           component: SelectPage, data: doc('Select') },
      { path: 'dashboard/text-field',       component: TextFieldPage, data: doc('Text Field') },
      { path: 'dashboard/alert',            component: AlertPage, data: doc('Alert') },
      { path: 'dashboard/checkbox',         component: CheckboxPage, data: doc('Checkbox') },
      { path: 'dashboard/progress-bar',     component: ProgressBarPage, data: doc('Progress Bar') },
      { path: 'dashboard/snackbar',         component: SnackbarPage, data: doc('Snackbar') },
      { path: 'dashboard/skeleton',         component: SkeletonPage, data: doc('Skeleton') },
      { path: 'dashboard/avatar',           component: AvatarPage, data: doc('Avatar') },
      { path: 'dashboard/avatar-group',     component: AvatarGroupPage, data: doc('Avatar Group') },
      { path: 'dashboard/user-chip',        component: UserChipPage, data: doc('User Chip') },
      { path: 'dashboard/bar-chart',        component: BarChartPage, data: doc('Bar Chart') },

      { path: 'modal/auth-modal',           component: AuthModalPage, data: doc('Auth Modal') },
      { path: 'modal/confirm-modal',        component: ConfirmModalPage, data: doc('Confirm Modal') },

      { path: 'page/not-found',             component: NotFoundPage, data: doc('Not Found') },
      { path: 'page/forbidden',             component: ForbiddenPage, data: doc('Forbidden') },
      { path: 'page/gone',                  component: GonePage, data: doc('Gone') },
      { path: 'page/login',                 component: LoginPage, data: doc('Login') },
      { path: 'page/auth-card',             component: AuthCardPage, data: doc('Auth Card') },

      { path: 'other/easter-egg',           component: EasterEggPage, data: doc('Easter Egg') },
    ],
  },

  {
    path: '',
    component: PublicLayout,
    children: [
      ...tyroUiErrorRoutes(),
    ],
  },
]);
