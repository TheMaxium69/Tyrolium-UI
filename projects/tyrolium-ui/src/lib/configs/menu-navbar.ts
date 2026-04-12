import { ITyroUiNavbarMenuCategory } from '../interface/ityro-ui-navbar-menu-category';
import { ITyroUiNavbarMenuItem } from '../interface/ityro-ui-navbar-menu-item';

export const NavbarMenuPinned: ITyroUiNavbarMenuItem = {
  name: 'Tyrolium',
  description: 'Maison mère',
  image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20Site.png',
  link: 'https://tyrolium.fr',
  iconBg: '#EEF2FF',
};

export const NavbarMenuCategory: ITyroUiNavbarMenuCategory[] = [
  {
    label: 'Projets',
    open: true,
    items: [
      {
        name: 'TyroServ',
        description: 'Server Minecraft',
        image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20ServerMC%20Sword%203D.png',
        link: '/useritium',
        iconBg: '#ebf5e1',
      },
      {
        name: 'SolidServ',
        description: 'Héberger de server',
        image: 'https://tyrolium.fr/Contenu/Image/SolidServ%20Site.png',
        link: '/solidserv',
        iconBg: '#E1F5EE',
      },
      {
        name: 'Influnias',
        description: "Agence d'influenceur",
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
        name: 'TyroStudio',
        description: 'Studio de jeu-vidéo',
        image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20Studio%20Site.png',
        iconBg: '#ffdbd0',
        link: '/influnias',
        subOpen: false,
        subItems: [
          {
            name: 'Rhodotales',
            description: 'Jeu de plateforme',
            image: 'https://tyrolium.fr/Contenu/Image/Vturias%20Site.png',
            link: '/vturias',
            iconBg: '#f3d9d9',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'Gamenium',
        description: 'Site actu jeu-vidéo',
        image: 'https://tyrolium.fr/Contenu/Image/Gamenium%20Lettre%20Site.png',
        link: '/gamenium',
        iconBg: '#FEF3C7',
      },
      {
        name: 'NexiumiaCRM',
        description: 'CRM',
        image: 'https://tyrolium.fr/Contenu/Image/NexiumiaCRM%20Site.png',
        link: '/gamenium',
        iconBg: '#e8c7fe',
      },

      {
        name: 'Useritium',
        description: 'Compte',
        image: 'https://tyrolium.fr/Contenu/Image/Useritium%20Site.png',
        link: '/useritium',
        iconBg: '#E1F5EE',
      },
    ],
  },
  {
    label: 'Interne',
    open: false,
    items: [
      {
        name: 'Jobs',
        description: "Offre d'emploi",
        image:
          'https://play-lh.googleusercontent.com/BaPQwHryyFBlxlFRhZdyTVFN77-KivMmcOano34lTpoB91fLcsvPu_pXH6gxEsRSxoM',
        link: '/erp',
        iconBg: '#EDE9FE',
      },
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
        name: 'Contactez-nous',
        description: 'Formulaire de contact',
        image: 'ri-file-text-line',
        link: '/terms',
        iconBg: '#F0F9FF',
      },
      {
        name: 'Boutique',
        description: "goodies au couleur de l'entreprise",
        image: 'ri-file-text-line',
        link: 'https://tyrolium-shop.myspreadshop.fr/',
        iconBg: '#F0F9FF',
      },
      {
        name: 'Terms',
        description: "Information sur l'entreprise",
        image: 'ri-file-text-line',
        link: '/terms',
        iconBg: '#F0F9FF',
      },
      {
        name: 'Serveurs',
        description: 'Liste des serveurs',
        image: 'https://tyrolium.fr/uptime/assets/vps.png',
        link: '/uptime',
        iconBg: '#ECFDF5',
        subOpen: false,
        subItems: [
          {
            name: 'Uptime Robot',
            description: 'Etat des serveurs',
            image: 'https://tyrolium.fr/uptime/assets/vps.png',
            link: '/vturias',
            iconBg: '#ead9f3',
            isSubItem: true,
          },
        ],
      },
    ],
  },
];

