import { ITyroUiNavbarMenuCategory } from '../interface/ityro-ui-navbar-menu-category';
import { ITyroUiNavbarMenuItem } from '../interface/ityro-ui-navbar-menu-item';

export const NavbarMenuPinned: ITyroUiNavbarMenuItem = {
  name: 'Tyrolium',
  description: 'Maison mère',
  descriptionEn: 'Parent company',
  image: 'assets/tyrolium-ui/projects/Tyrolium.png',
  link: 'https://tyrolium.fr',
};

export const NavbarMenuCategory: ITyroUiNavbarMenuCategory[] = [
  {
    label: 'Filiales',
    labelEn: 'Subsidiaries',
    open: true,
    items: [
      {
        name: 'TyroServ',
        description: 'Serveur Minecraft',
        descriptionEn: 'Minecraft Server',
        image: 'assets/tyrolium-ui/projects/TyroServ.png',
        link: 'https://tyroserv.fr',
      },
      {
        name: 'SolidServ',
        description: 'Héberger de serveur',
        descriptionEn: 'Server hosting',
        image: 'assets/tyrolium-ui/projects/SolidServ.png',
        link: 'https://solidserv.fr',
      },
      {
        name: 'Influnias',
        description: "Agence d'influenceur",
        descriptionEn: 'Influencer agency',
        image: 'assets/tyrolium-ui/projects/Influnias.png',
        link: 'https://www.influnias.fr',
        subOpen: false,
        subItems: [
          {
            name: 'Vturias',
            description: 'Agence de Vtubeur',
            descriptionEn: 'VTuber agency',
            image: 'assets/tyrolium-ui/projects/Vturias.png',
            link: 'https://vturias.fr',
            isSubItem: true,
          },
        ],
      },
      {
        name: 'TyroCiel',
        description: 'Studio de jeu-vidéo',
        descriptionEn: 'Video game studio',
        image: 'assets/tyrolium-ui/projects/TyroCiel.png',
        link: 'https://tyrociel.fr',
      },
      {
        name: 'Gamenium',
        description: "Site d'actu jeu-vidéo",
        descriptionEn: 'Gaming news site',
        image: 'assets/tyrolium-ui/projects/Gamenium.png',
        link: 'https://gamenium.fr',
      },
      {
        name: 'NexiumiaCRM',
        description: 'CRM',
        descriptionEn: 'CRM',
        image: 'assets/tyrolium-ui/projects/NexiumiaCRM.png',
        link: 'https://nexiumiacrm.fr',
      },
      {
        name: 'Useritium',
        description: 'Compte',
        descriptionEn: 'Account',
        image: 'assets/tyrolium-ui/projects/Useritium.png',
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
          'assets/tyrolium-ui/navbar/erp.png',
        link: 'https://jobs.tyrolium.fr',
      },
      {
        name: 'ERP',
        description: "Gestion d'entreprise",
        descriptionEn: 'Business management',
        image:
          'assets/tyrolium-ui/navbar/erp.png',
        link: 'https://app.tyrolium.fr',
      },
      {
        name: 'Repo',
        description: 'Serveur de Repository',
        descriptionEn: 'Repository server',
        image: 'assets/tyrolium-ui/navbar/repo.png',
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
        image: 'assets/tyrolium-ui/navbar/placeholder.png',
        link: '/contact',
        host: 'https://tyrolium.fr',
      },
      {
        name: 'Boutique',
        description: "Goodies aux couleurs de l'entreprise",
        descriptionEn: 'Company merchandise',
        image: 'assets/tyrolium-ui/navbar/placeholder.png',
        link: 'https://tyrolium-shop.myspreadshop.fr/',
      },
      {
        name: 'Mentions légales',
        description: 'Information',
        descriptionEn: 'Legal information',
        image: 'assets/tyrolium-ui/navbar/placeholder.png',
        link: '/legal',
        host: 'https://tyrolium.fr',
        subOpen: false,
        subItems: [
          {
            name: 'CGU',
            description: "Contrat général d'utilisation",
            descriptionEn: 'Terms of Service',
            image: 'assets/tyrolium-ui/navbar/placeholder.png',
            link: '/legal/cgu',
            host: 'https://tyrolium.fr',
            isSubItem: true,
          },
          {
            name: 'CGV',
            description: 'Contrat général de vente',
            descriptionEn: 'Terms of Sale',
            image: 'assets/tyrolium-ui/navbar/placeholder.png',
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
        image: 'assets/tyrolium-ui/navbar/server.png',
        link: 'https://tyrolium.fr/uptime/',
        subOpen: false,
        subItems: [
          {
            name: 'Uptime Robot',
            description: 'Etat des serveurs',
            descriptionEn: 'Server status',
            image: 'assets/tyrolium-ui/navbar/uptimerobot.svg',
            link: 'http://uptimerobot.tyrolium.fr',
            isSubItem: true,
          },
        ],
      },
    ],
  },
];
