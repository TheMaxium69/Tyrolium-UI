import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITyroUiNavbarPages, ITyroUiSubnavPages, TyroUiButtom, TyroUiNavbar, TyroUiSubnav } from 'tyrolium-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TyroUiButtom, TyroUiNavbar, TyroUiSubnav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /*
   *
   * GLOBAL VARIABLE
   *
   * */

  public APP_ENV = 'DEV';
  public PROJECT_NAME = 'SolidServ';
  public PROJECT_LOGO = 'https://tyrolium.fr/Contenu/Image/SolidServ%20Site.png';

  public pages: ITyroUiNavbarPages[] = [
    { label: 'Accueil', link: '/', icon: 'ri-home-line' },
    { label: 'Projet', link: '/project', icon: 'ri-folder-line' },
    {
      label: 'Prestation',
      icon: 'ri-briefcase-line',
      children: [
        { label: 'Développement web', link: '/prestation/web', icon: 'ri-code-line' },
        { label: 'Infrastructure', link: '/prestation/infra', icon: 'ri-server-line' },
        { label: 'Conseil', link: '/prestation/conseil' }, // pas d'icône, optionnel
      ],
    },
  ];

  public subpages: ITyroUiSubnavPages[] = [
    { label: 'Site Web', link: '/' },
    { label: 'Serveur', link: 'server' },
    { label: 'Minecraft', link: 'minecraft' },
  ];
}
