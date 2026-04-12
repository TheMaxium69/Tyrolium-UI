import { Component, HostListener, Input } from '@angular/core';
import { ITyroUiNavbarPages } from '../../interface/ityro-ui-navbar-pages';
import { RouterLink } from '@angular/router';


interface AppItem {
  name: string;
  description: string;
  image: string;
  link: string;
  iconBg?: string;
  subItems?: AppItem[]; // ← nouveau
  subOpen?: boolean; // ← état d'ouverture
  isSubItem?: boolean;
}

interface AppCategory {
  label: string;
  open: boolean;
}

@Component({
  selector: 'tyro-ui-navbar',
  imports: [RouterLink],
  templateUrl: './tyro-ui-navbar.html',
  styleUrl: './tyro-ui-navbar.css',
})
export class TyroUiNavbar {
  @Input() project: string = ''; /* tyrolium / solidserv / gamenium / ... */
  @Input() pages: ITyroUiNavbarPages[] = [];

  public pinnedApp: AppItem = {
    name: 'Tyrolium',
    description: 'Maison mère',
    image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20Site.png',
    link: 'https://tyrolium.fr',
    iconBg: '#EEF2FF',
  };

  public categories: (AppCategory & { items: AppItem[] })[] = [
    {
      label: 'Projets',
      open: true,
      items: [
        {
          name: 'Useritium',
          description: 'Compte',
          image: 'https://tyrolium.fr/Contenu/Image/Useritium%20Site.png',
          link: '/useritium',
          iconBg: '#E1F5EE',
        },
        {
          name: 'TyroServ',
          description: 'Server Minecraft',
          image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20ServerMC%20Sword%203D.png',
          link: '/useritium',
          iconBg: '#ebf5e1',
        },
        {
          name: 'SolidServ',
          description: 'Héberger',
          image: 'https://tyrolium.fr/Contenu/Image/SolidServ%20Site.png',
          link: '/solidserv',
          iconBg: '#E1F5EE',
        },
        {
          name: 'Influnias',
          description: 'Agence de créateur de contenu',
          image: 'https://tyrolium.fr/Contenu/Image/Influnias%20Site.png',
          iconBg: '#e7d0ff',
          link: '/influnias',
          subOpen: false,
          subItems: [
            {
              name: 'Vturias',
              description: 'Agence de Vtubeur',
              image: 'https://tyrolium.fr/Contenu/Image/Vturias%20Site.png',
              link: '/vturias',
              iconBg: '#ead9f3',
              isSubItem: true,
            },
          ],
        },
        {
          name: 'Gamenium',
          description: 'Site Actu',
          image: 'https://tyrolium.fr/Contenu/Image/Gamenium%20Lettre%20Site.png',
          link: '/gamenium',
          iconBg: '#FEF3C7',
        },
      ],
    },
    {
      label: 'Interne',
      open: true,
      items: [
        {
          name: 'ERP',
          description: "Gestion d'entreprise",
          image:
            'https://play-lh.googleusercontent.com/BaPQwHryyFBlxlFRhZdyTVFN77-KivMmcOano34lTpoB91fLcsvPu_pXH6gxEsRSxoM',
          link: '/erp',
          iconBg: '#EDE9FE',
        },
        {
          name: 'Repo',
          description: 'Serveur de Repository',
          image: 'http://repo.tyrolium.fr/assets/img/logo.png',
          link: '/erp',
          iconBg: '#EDE9FE',
        },
      ],
    },
    {
      label: 'Autre',
      open: false,
      items: [
        {
          name: 'Uptime',
          description: 'État des serveurs',
          image: 'https://tyrolium.fr/uptime/assets/vps.png',
          link: '/uptime',
          iconBg: '#ECFDF5',
        },
        {
          name: 'Terms',
          description: "Information sur l'entreprise",
          image: 'ri-file-text-line',
          link: '/terms',
          iconBg: '#F0F9FF',
        },
      ],
    },
  ];

  public menuOpen = false;

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleCategory(cat: AppCategory) {
    cat.open = !cat.open;
  }

  toggleSubItems(item: AppItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    item.subOpen = !item.subOpen;
  }

  getVisibleItems(items: AppItem[]): AppItem[] {
    const result: AppItem[] = [];
    for (const item of items) {
      result.push(item);
      if (item.subOpen && item.subItems?.length) {
        result.push(...item.subItems);
      }
    }
    return result;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-menu-wrapper')) {
      this.menuOpen = false;
    }
  }
}
