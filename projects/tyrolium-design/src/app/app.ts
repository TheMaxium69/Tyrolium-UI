import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITyroUiDashNavItem, TyroUiDashboardLayout } from 'tyrolium-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TyroUiDashboardLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  readonly PROJECT_NAME       = 'Tyrolium';
  readonly PROJECT_LOGO       = 'assets/tyrolium-ui/projects/Tyrolium.png';
  readonly PROJECT_LOGO_WHITE = 'assets/tyrolium-ui/projects/Tyrolium-White.png';
  readonly PROJECT_UTILITY    = 'Design';

  readonly navItems: ITyroUiDashNavItem[] = [
    { label: 'Accueil', icon: 'ri-home-4-line', link: '/' },
    {
      label: 'Composants', icon: 'ri-cube-line',
      category: true, open: true,
      children: [
        { label: 'Navbar',          icon: 'ri-layout-top-line',  link: '/components/navbar' },
        { label: 'Dashboard Layout',icon: 'ri-layout-left-line', link: '/components/dashboard-layout' },
      ],
    },
  ];
}
