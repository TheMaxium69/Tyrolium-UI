import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITyroUiDashNavItem, TyroUiDashboardLayout, TyroUiLangService, TyroUiSnackbar, TyroUiConfirmModal } from 'tyrolium-ui';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TyroUiDashboardLayout, TyroUiSnackbar, TyroUiConfirmModal],
  template: `
    <tyro-ui-dashboard-layout
      [project]="PROJECT_NAME"
      [logo]="PROJECT_LOGO"
      [logoWhite]="PROJECT_LOGO_WHITE"
      [utility]="PROJECT_UTILITY"
      [requireLogin]="false"
      [navItems]="navItems()">
      <router-outlet />
    </tyro-ui-dashboard-layout>
    <tyro-ui-snackbar></tyro-ui-snackbar>
    <tyro-ui-confirm-modal></tyro-ui-confirm-modal>
  `,
})
export class Layout {
  readonly PROJECT_NAME       = 'Tyrolium';
  readonly PROJECT_LOGO       = 'assets/tyrolium-ui/projects/Tyrolium.png';
  readonly PROJECT_LOGO_WHITE = 'assets/tyrolium-ui/projects/Tyrolium-White.png';
  readonly PROJECT_UTILITY    = 'Design';

  private readonly lang = inject(TyroUiLangService).lang;

  readonly navItems = computed<ITyroUiDashNavItem[]>(() => {
    const fr = this.lang() === 'fr';
    return [
      { label: fr ? 'Accueil' : 'Home', icon: 'ri-home-4-line', link: '/' },
      {
        label: fr ? 'Vitrine' : 'Showcase', icon: 'ri-layout-line',
        category: true, open: true,
        children: [
          { label: 'Navbar',  icon: 'ri-layout-top-line',      link: '/showcase/navbar' },
          { label: 'Subnav', icon: 'ri-layout-bottom-line',    link: '/showcase/subnav' },
          { label: 'Footer', icon: 'ri-layout-bottom-2-line',  link: '/showcase/footer' },
          { label: 'CTA',    icon: 'ri-megaphone-line',        link: '/showcase/cta' },
        ],
      },
      {
        label: 'Dashboard', icon: 'ri-layout-left-line',
        category: true, open: true,
        children: [
          /* ─── Structure ─── */
          { label: 'Dashboard Layout', icon: 'ri-layout-left-line',    link: '/dashboard/dashboard-layout' },
          { label: 'Page Header',      icon: 'ri-heading',              link: '/dashboard/page-header' },
          { label: 'Bento Card',       icon: 'ri-layout-grid-line',     link: '/dashboard/bento-card' },
          { label: 'Button Bento',     icon: 'ri-grid-line',            link: '/dashboard/button-bento' },
          { label: 'Data Table',       icon: 'ri-table-line',           link: '/dashboard/data-table' },
          /* ─── Contrôles ─── */
          { label: 'Button',           icon: 'ri-cursor-line',          link: '/dashboard/button' },
          { label: 'Button Group',     icon: 'ri-layout-row-line',      link: '/dashboard/button-group' },
          { label: 'Switch',           icon: 'ri-toggle-line',          link: '/dashboard/switch' },
          { label: 'Checkbox',         icon: 'ri-checkbox-line',        link: '/dashboard/checkbox' },
          { label: 'Select',           icon: 'ri-arrow-down-s-line',    link: '/dashboard/select' },
          { label: 'Text Field',       icon: 'ri-input-method-line',    link: '/dashboard/text-field' },
          /* ─── Feedback ─── */
          { label: 'Alert',            icon: 'ri-alarm-warning-line',   link: '/dashboard/alert' },
          { label: 'Snackbar',         icon: 'ri-notification-3-line',  link: '/dashboard/snackbar' },
          { label: 'Progress Bar',     icon: 'ri-progress-3-line',      link: '/dashboard/progress-bar' },
          { label: 'Chip',             icon: 'ri-price-tag-3-line',     link: '/dashboard/chip' },
          { label: 'Skeleton',         icon: 'ri-loader-4-line',        link: '/dashboard/skeleton' },
          /* ─── Personnes ─── */
          { label: 'Avatar',           icon: 'ri-user-3-line',          link: '/dashboard/avatar' },
          { label: 'Avatar Group',     icon: 'ri-group-line',           link: '/dashboard/avatar-group' },
        ],
      },
      {
        label: 'Modal', icon: 'ri-window-line',
        category: true, open: true,
        children: [
          { label: 'Auth Modal',    icon: 'ri-door-lock-line',   link: '/modal/auth-modal' },
          { label: 'Confirm Modal', icon: 'ri-question-line',   link: '/modal/confirm-modal' },
        ],
      },
      {
        label: 'Page', icon: 'ri-file-line',
        category: true, open: true,
        children: [
          { label: 'Not Found', icon: 'ri-question-mark', link: '/page/not-found' },
          { label: 'Forbidden', icon: 'ri-forbid-2-line', link: '/page/forbidden' },
        ],
      },
      {
        label: fr ? 'Autre' : 'Other', icon: 'ri-more-line',
        category: true, open: true,
        children: [
          { label: 'Easter Egg', icon: 'ri-gamepad-line', link: '/other/easter-egg' },
        ],
      },
    ];
  });
}
