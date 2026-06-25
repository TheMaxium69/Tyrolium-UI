import { ITyroUiFooterPage } from '../interface/ityro-ui-footer-page';

export const FooterProjectPage: ITyroUiFooterPage[] = [
    { label: 'Tyrolium',     icon: 'assets/tyrolium-ui/projects/Tyrolium.png',     link: 'https://tyrolium.fr' },
    { label: 'SolidServ',    icon: 'assets/tyrolium-ui/projects/SolidServ.png',    link: 'https://solidserv.fr' },
    { label: 'TyroServ',     icon: 'assets/tyrolium-ui/projects/TyroServ.png',     link: 'https://tyroserv.fr' },
    { label: 'TyroCiel',     icon: 'assets/tyrolium-ui/projects/TyroCiel.png',     link: 'https://tyrociel.fr' },
    { label: 'Gamenium',     icon: 'assets/tyrolium-ui/projects/Gamenium.png',     link: 'https://gamenium.fr' },
    { label: 'Useritium',    icon: 'assets/tyrolium-ui/projects/Useritium.png',    link: 'https://useritium.fr' },
    { label: 'NexiumiaCRM',  icon: 'assets/tyrolium-ui/projects/NexiumiaCRM.png',  link: 'https://nexiumiacrm.fr' },
    { label: 'Influnias',    icon: 'assets/tyrolium-ui/projects/Influnias.png',    link: 'https://influnias.fr' },
    { label: 'Vturias',      icon: 'assets/tyrolium-ui/projects/Vturias.png',      link: 'https://vturias.fr' },
];

export const FooterCorpoLink: ITyroUiFooterPage[] = [
    { label: 'RSE',           labelEn: 'CSR',           link: '/rse', host: 'https://tyrolium.fr' },
    { label: 'Partenaires',   labelEn: 'Partners',      link: '/partenaires', host: 'https://tyrolium.fr' },
    { label: 'Recrutements',  labelEn: 'Jobs',          link: 'https://jobs.tyrolium.fr' },
    { label: 'Tyrolium Labs', labelEn: 'Tyrolium Labs', link: '/labs', host: 'https://tyrolium.fr', },
    { label: 'Chronologie',   labelEn: 'Timeline',      link: '/chronologie', host: 'https://tyrolium.fr' },
    { label: 'Équipe',        labelEn: 'Team',          link: '/equipe',      host: 'https://tyrolium.fr' },
    { label: 'Media Kit',     labelEn: 'Media Kit',     link: '/mediakit',   host: 'https://tyrolium.fr' },
    { label: 'Boutique',      labelEn: 'Shop',          link: 'https://tyrolium-shop.myspreadshop.fr/' },
];

export const FooterServiceLink: ITyroUiFooterPage[] = [
    { label: 'Contactez-nous',        labelEn: 'Contact',           link: '/contact',  host: 'https://tyrolium.fr' },
    { label: 'Liste des Serveurs',    labelEn: 'Server list',       link: '/server',   host: 'https://tyrolium.fr' },
    { label: 'Uptime Robot',          labelEn: 'Uptime Robot',      link: 'https://stats.uptimerobot.com/7z9o3SEnWX' },
    { label: 'Design System',         labelEn: 'Design System',     link: 'https://design.tyrolium.fr' },
];

export const FooterInternalLink: ITyroUiFooterPage[] = [
    { label: 'Hub Interne',           labelEn: 'Internal Hub',      link: 'https://hub.tyrolium.fr' },
    { label: 'ERP Interne',           labelEn: 'Internal ERP',      link: 'https://app.tyrolium.fr' },
    { label: 'Serveur de Repository', labelEn: 'Repository server', link: 'http://repo.tyrolium.fr' },
];
