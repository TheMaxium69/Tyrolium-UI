import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
    ITyroUiNavbarPages,
    ITyroUiSubnavPages,
    TyroUiButtom, TyroUiCTA,
    TyroUiFooter,
    TyroUiNavbar,
    TyroUiSubnav
} from 'tyrolium-ui';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, TyroUiButtom, TyroUiNavbar, TyroUiSubnav, TyroUiFooter, TyroUiCTA],
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
  public PROJECT_CONTENT = `<strong>TyroServ</strong>, un serveur <strong>Minecraft moddé</strong> depuis <strong>2017</strong>,
                propose du <strong>PVP-Faction moddés</strong> (actuellement en saison 3) et bientôt des
                <strong>mini-jeux moddés</strong>. <strong>Gratuit</strong> et semi-crack, il offre une sécurité
                renforcée contre les tricheurs grâce à la création de comptes spécifiques.`


  /*
   *
   * PAGES
   *
   * */

  public pages: ITyroUiNavbarPages[] = [
    { label: 'Accueil', link: '/', icon: 'ri-home-line' },
    { label: 'Projet', link: '/project', icon: 'ri-folder-line' },
    { label: 'Serveur', link: '/project', icon: 'ri-folder-line' },
    {
      label: 'Produit',
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
