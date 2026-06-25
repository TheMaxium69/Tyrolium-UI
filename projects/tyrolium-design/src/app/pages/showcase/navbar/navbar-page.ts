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

interface PropRow  { prop: string; type: string; default: string; description: string; deprecated?: boolean; }
interface EventRow { event: string; payload: string; description: string; }
interface FieldRow { field: string; type: string; description: string; }

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
      description: 'Nom du projet affiché dans la navbar (ex : <em>"Tyrolium"</em>, <em>"Useritium"</em>)',
    },
    {
      prop: '[logo]', type: 'string', default: "''",
      description: 'URL du logo affiché à gauche — si vide, aucun logo',
    },
    {
      prop: '[subtitle]', type: 'string', default: "''",
      description: 'Label utilitaire affiché sous le projet en mode sidebar (ex : <em>"Dashboard"</em>)',
    },
    {
      prop: '[pages]', type: 'ITyroUiNavbarPages[]', default: '[]',
      description: 'Liens de navigation affichés dans la barre (voir interface ci-dessous)',
    },
    {
      prop: '[placeholder]', type: 'boolean', default: 'true',
      description: 'Affiche un bloc vide sous la navbar pour compenser son <code>position: fixed</code>',
    },
    {
      prop: '[sidebar]', type: 'boolean', default: 'false',
      description: 'Mode dashboard — passe la navbar en <code>position: relative</code> et affiche un burger qui émet <code>sidebarBurgerClick</code>',
    },
    {
      prop: '[currentUser]', type: 'any[]', default: '[]',
      description: 'Utiliser <code>TyroUiAuthService</code> à la place',
      deprecated: true,
    },
  ];

  /* ─── Outputs ─────────────────────────────────────── */

  readonly outputsData: EventRow[] = [
    {
      event: '(sidebarBurgerClick)', payload: 'void',
      description: 'Émis quand le burger est cliqué en mode <code>[sidebar]="true"</code> — utilisé par <code>tyro-ui-dashboard-layout</code> pour ouvrir la sidebar mobile',
    },
    {
      event: '(loginClick)', payload: 'void',
      description: "Émis après l'ouverture de la modale login (pour usage externe)",
    },
    {
      event: '(registerClick)', payload: 'void',
      description: "Émis après l'ouverture de la modale inscription",
    },
    {
      event: '(logoutClick)', payload: 'void',
      description: 'Émis après la déconnexion via <code>TyroUiAuthService.logout()</code>',
    },
  ];

  /* ─── Interface ITyroUiNavbarPages ────────────────── */

  readonly pagesInterfaceData: FieldRow[] = [
    { field: 'label',         type: 'string',               description: 'Texte affiché (fr)' },
    { field: 'labelEn?',      type: 'string',               description: 'Texte affiché (en)' },
    { field: 'link?',         type: 'string',               description: 'Route Angular (<code>routerLink</code>)' },
    { field: 'href?',         type: 'string',               description: 'Lien externe (<code>window.location.href</code>)' },
    { field: 'ancre?',        type: 'string',               description: "ID de l'élément vers lequel scroller" },
    { field: 'ancreHost?',    type: 'string',               description: 'Domaine hôte du scroll (si cross-domaine)' },
    { field: 'icon?',         type: 'string',               description: 'Classe icône remix-icon' },
    { field: 'children?',     type: 'ITyroUiNavbarPages[]', description: 'Sous-liens (dropdown)' },
    { field: 'childrenOpen?', type: 'boolean',              description: 'État ouvert/fermé du dropdown' },
  ];

  /* ─── NavbarMenuPinned ────────────────────────────── */

  readonly menuPinnedData: FieldRow[] = [
    { field: 'name',           type: 'string',                  description: 'Nom affiché' },
    { field: 'nameEn?',        type: 'string',                  description: 'Nom en anglais' },
    { field: 'description',    type: 'string',                  description: 'Sous-titre (fr)' },
    { field: 'descriptionEn?', type: 'string',                  description: 'Sous-titre (en)' },
    { field: 'image?',         type: 'string',                  description: 'URL logo couleur' },
    { field: 'imageLight?',    type: 'string',                  description: 'URL logo version dark' },
    { field: 'icon?',          type: 'string',                  description: "Classe remix-icon (si pas d'image)" },
    { field: 'link',           type: 'string',                  description: 'URL de destination' },
    { field: 'host?',          type: 'string',                  description: 'Domaine hôte si lien relatif' },
    { field: 'subItems?',      type: 'ITyroUiNavbarMenuItem[]', description: 'Sous-entrées (niveau 2)' },
    { field: 'subOpen?',       type: 'boolean',                 description: 'État ouvert des sous-entrées' },
    { field: 'isSubItem?',     type: 'boolean',                 description: 'Marque visuellement un sous-item' },
  ];

  /* ─── NavbarMenuCategory ──────────────────────────── */

  readonly menuCategoryData: FieldRow[] = [
    { field: 'label',    type: 'string',                  description: 'Titre de la catégorie (fr)' },
    { field: 'labelEn?', type: 'string',                  description: 'Titre de la catégorie (en)' },
    { field: 'open',     type: 'boolean',                 description: 'Catégorie dépliée par défaut' },
    { field: 'items',    type: 'ITyroUiNavbarMenuItem[]', description: 'Liste des apps dans cette catégorie' },
  ];
}
