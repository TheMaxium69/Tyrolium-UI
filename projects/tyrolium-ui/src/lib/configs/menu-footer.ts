import { ITyroUiFooterPage } from '../interface/ityro-ui-footer-page';

export const FooterProjectPage: ITyroUiFooterPage[] = [
    { label: 'Tyrolium',     icon: 'assets/Tyrolium.png',    link: 'https://tyrolium.fr' },
    { label: 'TyroServ',     icon: 'assets/TyroServ.png',    link: 'https://tyroserv.fr' },
    { label: 'SolidServ',    icon: 'assets/SolidServ.png',   link: 'https://solidserv.fr' },
    { label: 'Influnias',    icon: 'assets/Influnias.png',   link: 'https://www.influnias.fr' },
    { label: 'Vturias',      icon: 'https://tyrolium.fr/Contenu/Image/Vturias%20Site.png', link: 'https://vturias.fr' },
    { label: 'TyroCiel',     icon: 'assets/TyroCiel.png',    link: 'https://tyrociel.fr' },
    { label: 'Gamenium',     icon: 'assets/Gamenium.png',    link: 'https://gamenium.fr' },
    { label: 'NexiumiaCRM',  icon: 'assets/NexiumiaCRM.png', link: 'https://nexiumiacrm.fr' },
    { label: 'Useritium',    icon: 'https://tyrolium.fr/Contenu/Image/Useritium%20Site.png', link: 'https://useritium.fr' },
];

export const FooterOtherLink: ITyroUiFooterPage[] = [
    { label: 'Contactez-nous',        labelEn: 'Contact us',         link: '/contact',                              host: 'https://tyrolium.fr' },
    { label: 'Boutique',              labelEn: 'Shop',                link: 'https://tyrolium-shop.myspreadshop.fr/' },
    { label: 'Recrutements',          labelEn: 'Jobs',                link: 'https://jobs.tyrolium.fr' },
    { label: 'ERP Interne',           labelEn: 'Internal ERP',        link: 'https://app.tyrolium.fr' },
    { label: 'Serveur de Repository', labelEn: 'Repository server',   link: 'http://repo.tyrolium.fr' },
    { label: 'Liste des Serveurs',    labelEn: 'Server list',         link: 'https://tyrolium.fr/uptime/' },
    { label: 'Uptime Robot',          labelEn: 'Uptime Robot',        link: 'http://uptimerobot.tyrolium.fr' },
    { label: 'Mentions légales',      labelEn: 'Legal notice',        link: '/legal',                                host: 'https://tyrolium.fr' },
    { label: 'CGU',                   labelEn: 'TOS',                 link: '/legal/cgu',                            host: 'https://tyrolium.fr' },
    { label: 'CGV',                   labelEn: 'Terms of Sale',       link: '/legal/cgv',                            host: 'https://tyrolium.fr' },
];
