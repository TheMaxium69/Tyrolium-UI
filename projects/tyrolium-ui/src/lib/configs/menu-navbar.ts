import { ITyroUiNavbarMenuCategory } from '../interface/ityro-ui-navbar-menu-category';
import { ITyroUiNavbarMenuItem } from '../interface/ityro-ui-navbar-menu-item';

export const NavbarMenuPinned: ITyroUiNavbarMenuItem = {
  name: 'Tyrolium',
  description: 'Maison mère',
  descriptionEn: 'Parent company',
  image: 'assets/Tyrolium.png',
  link: 'https://tyrolium.fr',
};

export const NavbarMenuCategory: ITyroUiNavbarMenuCategory[] = [
  {
    label: 'Projets',
    labelEn: 'Projects',
    open: true,
    items: [
      {
        name: 'TyroServ',
        description: 'Serveur Minecraft',
        descriptionEn: 'Minecraft Server',
        image: 'assets/TyroServ.png',
        link: 'https://tyroserv.fr',
      },
      {
        name: 'SolidServ',
        description: 'Héberger de serveur',
        descriptionEn: 'Server hosting',
        image: 'assets/SolidServ.png',
        link: 'https://solidserv.fr',
      },
      {
        name: 'Influnias',
        description: "Agence d'influenceur",
        descriptionEn: 'Influencer agency',
        image: 'assets/Influnias.png',
        link: 'https://www.influnias.fr',
        subOpen: false,
        subItems: [
          {
            name: 'Vturias',
            description: 'Agence de Vtubeur',
            descriptionEn: 'VTuber agency',
            image: 'https://tyrolium.fr/Contenu/Image/Vturias%20Site.png',
            link: 'https://vturias.fr',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'TyroCiel',
        description: 'Studio de jeu-vidéo',
        descriptionEn: 'Video game studio',
        image: 'assets/TyroCiel.png',
        link: 'https://tyrociel.fr',
      },
      {
        name: 'Gamenium',
        description: "Site d'actu jeu-vidéo",
        descriptionEn: 'Gaming news site',
        image: 'assets/Gamenium.png',
        link: 'https://gamenium.fr',
      },
      {
        name: 'NexiumiaCRM',
        description: 'CRM',
        descriptionEn: 'CRM',
        image: 'assets/NexiumiaCRM.png',
        link: 'https://nexiumiacrm.fr',
      },
      {
        name: 'Useritium',
        description: 'Compte',
        descriptionEn: 'Account',
        image: 'https://tyrolium.fr/Contenu/Image/Useritium%20Site.png',
        link: 'https://useritium.fr',
      },
    ],
  },
  {
    label: 'Interne',
    labelEn: 'Internal',
    open: false,
    items: [
      {
        name: 'Jobs',
        description: "Offre d'emploi",
        descriptionEn: 'Job offers',
        image:
          'https://play-lh.googleusercontent.com/BaPQwHryyFBlxlFRhZdyTVFN77-KivMmcOano34lTpoB91fLcsvPu_pXH6gxEsRSxoM',
        link: 'https://jobs.tyrolium.fr',
      },
      {
        name: 'ERP',
        description: "Gestion d'entreprise",
        descriptionEn: 'Business management',
        image:
          'https://play-lh.googleusercontent.com/BaPQwHryyFBlxlFRhZdyTVFN77-KivMmcOano34lTpoB91fLcsvPu_pXH6gxEsRSxoM',
        link: 'https://app.tyrolium.fr',
      },
      {
        name: 'Repo',
        description: 'Serveur de Repository',
        descriptionEn: 'Repository server',
        image: 'http://repo.tyrolium.fr/assets/img/logo.png',
        link: 'http://repo.tyrolium.fr',
      },
    ],
  },
  {
    label: 'Autre',
    labelEn: 'Other',
    open: false,
    items: [
      {
        name: 'Contactez-nous',
        description: 'Formulaire de contact',
        descriptionEn: 'Contact form',
        image: 'ri-file-text-line',
        link: '/contact',
        host: 'https://tyrolium.fr',
      },
      {
        name: 'Boutique',
        description: "Goodies aux couleurs de l'entreprise",
        descriptionEn: 'Company merchandise',
        image: 'ri-file-text-line',
        link: 'https://tyrolium-shop.myspreadshop.fr/',
      },
      {
        name: 'Mentions légales',
        description: 'Information',
        descriptionEn: 'Legal information',
        image: 'ri-file-text-line',
        link: '/legal',
        host: 'https://tyrolium.fr',
        subOpen: false,
        subItems: [
          {
            name: 'CGU',
            description: "Contrat général d'utilisation",
            descriptionEn: 'Terms of Service',
            image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptimerobot.svg',
            link: '/legal/cgu',
            host: 'https://tyrolium.fr',
            isSubItem: true,
          },
          {
            name: 'CGV',
            description: 'Contrat général de vente',
            descriptionEn: 'Terms of Sale',
            image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptimerobot.svg',
            link: '/legal/cgv',
            host: 'https://tyrolium.fr',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'Serveurs',
        description: 'Liste des serveurs',
        descriptionEn: 'Server list',
        image: 'https://tyrolium.fr/uptime/assets/vps.png',
        link: 'https://tyrolium.fr/uptime/',
        subOpen: false,
        subItems: [
          {
            name: 'Uptime Robot',
            description: 'Etat des serveurs',
            descriptionEn: 'Server status',
            image: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptimerobot.svg',
            link: 'http://uptimerobot.tyrolium.fr',
            isSubItem: true,
          },
        ],
      },
    ],
  },
];
