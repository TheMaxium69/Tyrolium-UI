import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITyroUiDashNavItem, TyroUiDashboardLayout } from 'tyrolium-ui';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TyroUiDashboardLayout],
  template: `
    <tyro-ui-dashboard-layout
      [project]="PROJECT_NAME"
      [logo]="PROJECT_LOGO"
      [logoWhite]="PROJECT_LOGO_WHITE"
      [utility]="PROJECT_UTILITY"
      [navItems]="navItems">
      <router-outlet />
    </tyro-ui-dashboard-layout>
  `,
})
export class Layout {
  readonly PROJECT_NAME       = 'Tyrolium';
  readonly PROJECT_LOGO       = 'assets/tyrolium-ui/projects/Tyrolium.png';
  readonly PROJECT_LOGO_WHITE = 'assets/tyrolium-ui/projects/Tyrolium-White.png';
  readonly PROJECT_UTILITY    = 'Design';

  readonly navItems: ITyroUiDashNavItem[] = [
    { label: 'Accueil', icon: 'ri-home-4-line', link: '/' },
    {
      label: 'Showcase', icon: 'ri-layout-line',
      category: true, open: true,
      children: [
        { label: 'Navbar',  icon: 'ri-layout-top-line',      link: '/showcase/navbar' },
        { label: 'Subnav', icon: 'ri-layout-bottom-line',    link: '/showcase/subnav' },
        { label: 'Footer', icon: 'ri-layout-bottom-2-line',  link: '/showcase/footer' },
        { label: 'CTA',    icon: 'ri-cursor-line',           link: '/showcase/cta' },
      ],
    },
    {
      label: 'Dashboard', icon: 'ri-layout-left-line',
      category: true, open: true,
      children: [
        { label: 'Dashboard Layout', icon: 'ri-layout-left-line', link: '/dashboard/dashboard-layout' },
      ],
    },
    {
      label: 'Modal', icon: 'ri-window-line',
      category: true, open: true,
      children: [
        { label: 'Auth Modal', icon: 'ri-door-lock-line', link: '/modal/auth-modal' },
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
      label: 'Other', icon: 'ri-more-line',
      category: true, open: true,
      children: [
        { label: 'Easter Egg', icon: 'ri-gamepad-line', link: '/other/easter-egg' },
      ],
    },
  ];
}
