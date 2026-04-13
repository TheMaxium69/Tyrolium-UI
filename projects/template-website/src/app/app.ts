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
    { label: 'Accueil', link: '/' },
    { label: 'Projet', link: '/project' },
    { label: 'Prestation', link: '/prestation' },
  ];

  public subpages: ITyroUiSubnavPages[] = [
    { label: 'Site Web', link: '/' },
    { label: 'Serveur', link: 'server' },
    { label: 'Minecraft', link: 'minecraft' },
  ];
}
