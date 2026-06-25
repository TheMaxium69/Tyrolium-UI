import { Component, inject } from '@angular/core';
import {
  TyroUiNavbar,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiChip,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; deprecated?: boolean; }
interface EventRow { event: string; payload: string; description: string; descriptionEn?: string; }
interface FieldRow { field: string; type: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-navbar-page',
  imports: [TyroUiNavbar, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiChip, TyroUiBentoCard],
  templateUrl: './navbar-page.html',
  styleUrl: './navbar-page.css',
})
export class NavbarPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '200px' },
    { key: 'type',        label: 'Type',                             width: '160px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '90px'  },
    { key: 'description', label: 'Description' },
  ];

  readonly eventCols: ITyroUiDataTableColumn[] = [
    { key: 'event',       label: 'Événement',  labelEn: 'Event',    width: '240px' },
    { key: 'payload',     label: 'Payload',                          width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  readonly fieldCols: ITyroUiDataTableColumn[] = [
    { key: 'field',       label: 'Champ',      labelEn: 'Field',    width: '200px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[project]', type: 'string', default: "''",
      description:   'Nom du projet affiché dans la navbar (ex : <em>"Tyrolium"</em>, <em>"Useritium"</em>)',
      descriptionEn: 'Project name displayed in the navbar (e.g. <em>"Tyrolium"</em>, <em>"Useritium"</em>)',
    },
    {
      prop: '[logo]', type: 'string', default: "''",
      description:   'URL du logo affiché à gauche - si vide, aucun logo',
      descriptionEn: 'Logo URL displayed on the left - if empty, no logo is shown',
    },
    {
      prop: '[subtitle]', type: 'string', default: "''",
      description:   'Label utilitaire affiché sous le projet en mode sidebar (ex : <em>"Dashboard"</em>)',
      descriptionEn: 'Utility label displayed below the project name in sidebar mode (e.g. <em>"Dashboard"</em>)',
    },
    {
      prop: '[pages]', type: 'ITyroUiNavbarPages[]', default: '[]',
      description:   'Liens de navigation affichés dans la barre (voir interface ci-dessous)',
      descriptionEn: 'Navigation links displayed in the bar (see interface below)',
    },
    {
      prop: '[placeholder]', type: 'boolean', default: 'true',
      description:   'Affiche un bloc vide sous la navbar pour compenser son <code>position: fixed</code>',
      descriptionEn: 'Renders an empty block below the navbar to compensate for its <code>position: fixed</code>',
    },
    {
      prop: '[sidebar]', type: 'boolean', default: 'false',
      description:   'Mode dashboard - passe la navbar en <code>position: relative</code> et affiche un burger qui émet <code>sidebarBurgerClick</code>',
      descriptionEn: 'Dashboard mode - switches the navbar to <code>position: relative</code> and shows a burger button that emits <code>sidebarBurgerClick</code>',
    },
    {
      prop: '[currentUser]', type: 'any[]', default: '[]',
      description:   'Utiliser <code>TyroUiAuthService</code> à la place',
      descriptionEn: 'Use <code>TyroUiAuthService</code> instead',
      deprecated: true,
    },
  ];

  /* ─── Outputs ─────────────────────────────────────── */

  readonly outputsData: EventRow[] = [
    {
      event: '(sidebarBurgerClick)', payload: 'void',
      description:   'Émis quand le burger est cliqué en mode <code>[sidebar]="true"</code> - utilisé par <code>tyro-ui-dashboard-layout</code> pour ouvrir la sidebar mobile',
      descriptionEn: 'Emitted when the burger is clicked in <code>[sidebar]="true"</code> mode - used by <code>tyro-ui-dashboard-layout</code> to open the mobile sidebar',
    },
    {
      event: '(loginClick)', payload: 'void',
      description:   "Émis après l'ouverture de la modale login (pour usage externe)",
      descriptionEn: 'Emitted after the login modal opens (for external use)',
    },
    {
      event: '(registerClick)', payload: 'void',
      description:   "Émis après l'ouverture de la modale inscription",
      descriptionEn: 'Emitted after the register modal opens',
    },
    {
      event: '(logoutClick)', payload: 'void',
      description:   'Émis après la déconnexion via <code>TyroUiAuthService.logout()</code>',
      descriptionEn: 'Emitted after logout via <code>TyroUiAuthService.logout()</code>',
    },
  ];

  /* ─── Interface ITyroUiNavbarPages ────────────────── */

  readonly pagesInterfaceData: FieldRow[] = [
    { field: 'label',         type: 'string',               description: 'Texte affiché (fr)',                               descriptionEn: 'Displayed text (fr)' },
    { field: 'labelEn?',      type: 'string',               description: 'Texte affiché (en)',                               descriptionEn: 'Displayed text (en)' },
    { field: 'link?',         type: 'string',               description: 'Route Angular (<code>routerLink</code>)',           descriptionEn: 'Angular route (<code>routerLink</code>)' },
    { field: 'href?',         type: 'string',               description: 'Lien externe (<code>window.location.href</code>)', descriptionEn: 'External link (<code>window.location.href</code>)' },
    { field: 'ancre?',        type: 'string',               description: "ID de l'élément vers lequel scroller",             descriptionEn: 'ID of the element to scroll to' },
    { field: 'ancreHost?',    type: 'string',               description: 'Domaine hôte pour le scroll cross-domaine',        descriptionEn: 'Host domain for cross-domain scroll' },
    { field: 'icon?',         type: 'string',               description: 'Classe icône remix-icon',                          descriptionEn: 'Remix-icon class' },
    { field: 'children?',     type: 'ITyroUiNavbarPages[]', description: 'Sous-liens (dropdown)',                            descriptionEn: 'Sub-links (dropdown)' },
    { field: 'childrenOpen?', type: 'boolean',              description: 'État ouvert/fermé du dropdown',                    descriptionEn: 'Dropdown open/closed state' },
  ];

  /* ─── NavbarMenuPinned ────────────────────────────── */

  readonly menuPinnedData: FieldRow[] = [
    { field: 'name',           type: 'string',                  description: 'Nom affiché',                          descriptionEn: 'Displayed name' },
    { field: 'nameEn?',        type: 'string',                  description: 'Nom en anglais',                       descriptionEn: 'English name' },
    { field: 'description',    type: 'string',                  description: 'Sous-titre (fr)',                      descriptionEn: 'Subtitle (fr)' },
    { field: 'descriptionEn?', type: 'string',                  description: 'Sous-titre (en)',                      descriptionEn: 'Subtitle (en)' },
    { field: 'image?',         type: 'string',                  description: 'URL logo couleur',                     descriptionEn: 'Color logo URL' },
    { field: 'imageLight?',    type: 'string',                  description: 'URL logo version dark',                descriptionEn: 'Dark mode logo URL' },
    { field: 'icon?',          type: 'string',                  description: "Classe remix-icon (si pas d'image)",   descriptionEn: 'Remix-icon class (if no image)' },
    { field: 'link',           type: 'string',                  description: 'URL de destination',                   descriptionEn: 'Destination URL' },
    { field: 'host?',          type: 'string',                  description: 'Domaine hôte si lien relatif',         descriptionEn: 'Host domain for relative links' },
    { field: 'subItems?',      type: 'ITyroUiNavbarMenuItem[]', description: 'Sous-entrées (niveau 2)',              descriptionEn: 'Sub-entries (level 2)' },
    { field: 'subOpen?',       type: 'boolean',                 description: 'État ouvert des sous-entrées',         descriptionEn: 'Sub-entries open state' },
    { field: 'isSubItem?',     type: 'boolean',                 description: 'Marque visuellement un sous-item',     descriptionEn: 'Visually marks as a sub-item' },
  ];

  /* ─── NavbarMenuCategory ──────────────────────────── */

  readonly menuCategoryData: FieldRow[] = [
    { field: 'label',    type: 'string',                  description: 'Titre de la catégorie (fr)',          descriptionEn: 'Category title (fr)' },
    { field: 'labelEn?', type: 'string',                  description: 'Titre de la catégorie (en)',          descriptionEn: 'Category title (en)' },
    { field: 'open',     type: 'boolean',                 description: 'Catégorie dépliée par défaut',        descriptionEn: 'Category expanded by default' },
    { field: 'items',    type: 'ITyroUiNavbarMenuItem[]', description: 'Liste des apps dans cette catégorie', descriptionEn: 'List of apps in this category' },
  ];
}
