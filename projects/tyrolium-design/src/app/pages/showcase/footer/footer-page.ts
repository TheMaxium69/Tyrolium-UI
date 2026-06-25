import { Component, computed, inject } from '@angular/core';
import {
  TyroUiFooter,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  ITyroUiNavbarPages,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow     { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface ConstantRow { constant: string; content: string; contentEn?: string; }
interface FieldRow    { field: string; type: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-footer-page',
  imports: [TyroUiFooter, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './footer-page.html',
})
export class FooterPage {
  private readonly langService = inject(TyroUiLangService);
  readonly lang = this.langService.lang;

  /* ─── Preview data ────────────────────────────────── */

  readonly pages = computed<ITyroUiNavbarPages[]>(() => {
    const en = this.lang() === 'en';
    return en
      ? [
          { label: 'Home',          link: '/',                  icon: 'ri-home-line' },
          { label: 'Subsidiaries',  link: '/project',           icon: 'ri-stack-line' },
          { label: 'Services',      icon: 'ri-briefcase-line',
            children: [
              { label: 'Website',   link: '/prestation/web',        icon: 'ri-global-line' },
              { label: 'Server',    link: '/prestation/server',     icon: 'ri-server-line' },
              { label: 'Training',  link: '/prestation/formation',  icon: 'ri-graduation-cap-line' },
              { label: 'Incubator', link: '/prestation/incubateur', icon: 'ri-rocket-2-line' },
              { label: 'Minecraft', link: '/prestation/minecraft',  icon: 'ri-gamepad-line' },
            ],
          },
        ]
      : [
          { label: 'Accueil',    link: '/',        icon: 'ri-home-line' },
          { label: 'Filiales',   link: '/project', icon: 'ri-stack-line' },
          { label: 'Prestation', link: '/prestation', icon: 'ri-briefcase-line',
            children: [
              { label: 'Site Web',   link: '/prestation/web',        icon: 'ri-global-line' },
              { label: 'Serveur',    link: '/prestation/server',     icon: 'ri-server-line' },
              { label: 'Formation',  link: '/prestation/formation',  icon: 'ri-graduation-cap-line' },
              { label: 'Incubateur', link: '/prestation/incubateur', icon: 'ri-rocket-2-line' },
              { label: 'Minecraft',  link: '/prestation/minecraft',  icon: 'ri-gamepad-line' },
            ],
          },
        ];
  });

  readonly content = computed(() =>
    this.lang() === 'en'
      ? `<strong>Tyrolium</strong> is a <strong>French tech holding company</strong> founded in <strong>2017</strong> by digital enthusiasts. From <strong>web development</strong> to <strong>cloud infrastructure</strong>, we support every project with expertise and passion. In parallel, we build our <strong>own ecosystem of projects</strong>: from hosting to gaming, CRM and social networks. <em>Founded by Maxime Tournier</em>`
      : `<strong>Tyrolium</strong> est une <strong>holding technologique française</strong> fondée en <strong>2017</strong> par des passionnés du numérique. De la <strong>conception web</strong> à l'<strong>infrastructure cloud</strong>, nous accompagnons chaque projet avec expertise et passion. En parallèle, nous développons notre <strong>propre écosystème de projets</strong> : de l'hébergement au gaming, en passant par le CRM et les réseaux sociaux. <em>Fondé par Maxime Tournier</em>`
  );

  readonly socials: ITyroUiNavbarPages[] = [
    { label: 'facebook',  link: 'https://www.facebook.com/tyrolium/',               icon: 'ri-facebook-fill' },
    { label: 'instagram', link: 'https://www.instagram.com/tyroliumentertainment/', icon: 'ri-instagram-line' },
    { label: 'x',         link: 'https://x.com/TyroliumE',                          icon: 'ri-twitter-x-fill' },
    { label: 'youtube',   link: 'https://www.youtube.com/@tyrolium',                icon: 'ri-youtube-fill' },
    { label: 'discord',   link: 'https://discord.com/invite/km8h5jHezt',            icon: 'ri-discord-fill' },
    { label: 'linkedin',  link: 'https://www.linkedin.com/company/tyrolium/',       icon: 'ri-linkedin-fill' },
    { label: 'tiktok',    link: 'https://www.tiktok.com/@tyrolium',                 icon: 'ri-tiktok-fill' },
    { label: 'twitch',    link: 'https://www.twitch.tv/tyrolium',                   icon: 'ri-twitch-fill' },
    { label: 'github',    link: 'https://github.com/tyrolium',                      icon: 'ri-github-fill' },
    { label: 'telegram',  link: 'https://t.me/tyrolium',                            icon: 'ri-telegram-fill' },
    { label: 'thread',    link: 'https://www.threads.com/@tyroliumentertainment',   icon: 'ri-threads-fill' },
  ];

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property',    width: '200px' },
    { key: 'type',        label: 'Type',                                width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',     width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  readonly constantCols: ITyroUiDataTableColumn[] = [
    { key: 'constant', label: 'Constante', labelEn: 'Constant',    width: '240px' },
    { key: 'content',  label: 'Contenu',   labelEn: 'Description' },
  ];

  readonly fieldCols: ITyroUiDataTableColumn[] = [
    { key: 'field',       label: 'Champ',  labelEn: 'Field', width: '160px' },
    { key: 'type',        label: 'Type',                      width: '160px' },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[project]', type: 'string', default: "''",
      description:   "Identifiant du projet (ex : <em>\"tyrolium\"</em>, <em>\"solidserv\"</em>) - influence le contenu affiché",
      descriptionEn: 'Project identifier (e.g. <em>"tyrolium"</em>, <em>"solidserv"</em>) - affects the displayed content',
    },
    {
      prop: '[logo]', type: 'string', default: "''",
      description:   'URL du logo affiché en haut du footer',
      descriptionEn: 'Logo URL displayed at the top of the footer',
    },
    {
      prop: '[content]', type: 'string', default: "''",
      description:   'Texte de description affiché sous le logo (supporte le HTML)',
      descriptionEn: 'Description text displayed below the logo (supports HTML)',
    },
    {
      prop: '[pages]', type: 'ITyroUiNavbarPages[]', default: '[]',
      description:   'Liens spécifiques au projet affichés dans la colonne de gauche',
      descriptionEn: 'Project-specific links displayed in the left column',
    },
    {
      prop: '[socials]', type: 'ITyroUiNavbarPages[]', default: '[]',
      description:   'Liens réseaux sociaux du projet',
      descriptionEn: 'Social media links for the project',
    },
  ];

  /* ─── Config constants ────────────────────────────── */

  readonly constantsData: ConstantRow[] = [
    {
      constant: 'FooterProjectPage',
      content:   'Logos de toutes les filiales Tyrolium (9 projets)',
      contentEn: 'Logos of all Tyrolium subsidiaries (9 projects)',
    },
    {
      constant: 'FooterCorpoLink',
      content:   'Liens corporate : RSE, Partenaires, Recrutements, Labs, Chronologie, Équipe, Media Kit, Boutique',
      contentEn: 'Corporate links: CSR, Partners, Jobs, Labs, Timeline, Team, Media Kit, Shop',
    },
    {
      constant: 'FooterServiceLink',
      content:   'Liens service : Contact, Serveurs, Uptime Robot',
      contentEn: 'Service links: Contact, Servers, Uptime Robot',
    },
    {
      constant: 'FooterInternalLink',
      content:   'Liens internes (ERP, Repo) - visibles uniquement en interne',
      contentEn: 'Internal links (ERP, Repo) - visible internally only',
    },
  ];

  /* ─── Interface ITyroUiFooterPage ─────────────────── */

  readonly footerPageInterfaceData: FieldRow[] = [
    { field: 'label',    type: 'string',  description: 'Texte du lien (fr)',                               descriptionEn: 'Link text (fr)' },
    { field: 'labelEn?', type: 'string',  description: 'Texte du lien (en)',                               descriptionEn: 'Link text (en)' },
    { field: 'link',     type: 'string',  description: 'URL de destination (absolue ou relative)',         descriptionEn: 'Destination URL (absolute or relative)' },
    { field: 'icon?',    type: 'string',  description: 'URL logo ou classe remix-icon',                    descriptionEn: 'Logo URL or remix-icon class' },
    { field: 'host?',    type: 'string',  description: 'Domaine hôte si lien relatif (ex : <em>"https://tyrolium.fr"</em>)', descriptionEn: 'Host domain for relative links (e.g. <em>"https://tyrolium.fr"</em>)' },
  ];
}
