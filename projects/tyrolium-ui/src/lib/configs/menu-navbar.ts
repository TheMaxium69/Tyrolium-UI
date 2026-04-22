import { ITyroUiNavbarMenuCategory } from '../interface/ityro-ui-navbar-menu-category';
import { ITyroUiNavbarMenuItem } from '../interface/ityro-ui-navbar-menu-item';

export const NavbarMenuPinned: ITyroUiNavbarMenuItem = {
  name: 'Tyrolium',
  description: 'Maison mère',
  image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20Site.png',
  link: 'https://tyrolium.fr',
  iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
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
        link: 'https://tyroserv.fr',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'SolidServ',
        description: 'Héberger de server',
        image: 'https://tyrolium.fr/Contenu/Image/SolidServ%20Site.png',
        link: 'https://solidserv.fr',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'Influnias',
        description: "Agence d'influenceur",
        image: 'https://tyrolium.fr/Contenu/Image/Influnias%20Site.png',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
        link: 'https://www.influnias.fr',
        subOpen: false,
        subItems: [
          {
            name: 'Vturias',
            description: 'Agence de Vtubeur',
            image: 'https://tyrolium.fr/Contenu/Image/Vturias%20Site.png',
            link: 'https://vturias.fr',
            iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'TyroStudio',
        description: 'Studio de jeu-vidéo',
        image: 'https://tyrolium.fr/Contenu/Image/Tyrolium%20Studio%20Site.png',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
        link: '/influnias',
        subOpen: false,
        subItems: [
          {
            name: 'Rhodotales',
            description: 'Jeu de plateforme',
            image: 'https://tyrolium.fr/Contenu/Image/Vturias%20Site.png',
            link: '/vturias',
            iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'Gamenium',
        description: 'Site actu jeu-vidéo',
        image: 'https://tyrolium.fr/Contenu/Image/Gamenium%20Lettre%20Site.png',
        link: '/gamenium',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'NexiumiaCRM',
        description: 'CRM',
        image: 'https://tyrolium.fr/Contenu/Image/NexiumiaCRM%20Site.png',
        link: '/gamenium',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },

      {
        name: 'Useritium',
        description: 'Compte',
        image: 'https://tyrolium.fr/Contenu/Image/Useritium%20Site.png',
        link: '/useritium',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
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
        link: 'https://jobs.tyrolium.fr',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'ERP',
        description: "Gestion d'entreprise",
        image:
          'https://play-lh.googleusercontent.com/BaPQwHryyFBlxlFRhZdyTVFN77-KivMmcOano34lTpoB91fLcsvPu_pXH6gxEsRSxoM',
        link: 'https://app.tyrolium.fr',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'Repo',
        description: 'Serveur de Repository',
        image: 'http://repo.tyrolium.fr/assets/img/logo.png',
        link: 'http://repo.tyrolium.fr',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
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
        link: '/contact',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'Boutique',
        description: "goodies au couleur de l'entreprise",
        image: 'ri-file-text-line',
        link: 'https://tyrolium-shop.myspreadshop.fr/',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
      },
      {
        name: 'Terms',
        description: "Information sur l'entreprise",
        image: 'ri-file-text-line',
        link: '/terms',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
        subOpen: false,
        subItems: [
          {
            name: 'GGU',
            description: 'Contrat général d\'utilisation',
            image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptimerobot.svg',
            link: 'http://uptimerobot.tyrolium.fr',
            iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
            isSubItem: true,
          },
          {
            name: 'GGV',
            description: 'Contrat général de vente',
            image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptimerobot.svg',
            link: 'http://uptimerobot.tyrolium.fr',
            iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'Serveurs',
        description: 'Liste des serveurs',
        image: 'https://tyrolium.fr/uptime/assets/vps.png',
        link: 'https://tyrolium.fr/uptime/',
        iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
        subOpen: false,
        subItems: [
          {
            name: 'Uptime Robot',
            description: 'Etat des serveurs',
            image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptimerobot.svg',
            link: 'http://uptimerobot.tyrolium.fr',
            iconBg: 'linear-gradient(135deg, #001a6e 0%, #ee2b2b 100%)',
            isSubItem: true,
          },
        ],
      },
    ],
  },
];

