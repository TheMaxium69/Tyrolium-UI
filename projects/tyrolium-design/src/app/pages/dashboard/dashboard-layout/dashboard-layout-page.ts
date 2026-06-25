import { Component, inject } from '@angular/core';
import {
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface FieldRow { field: string; type: string; description: string; descriptionEn?: string; }
interface StateRow { state: string; stateEn?: string; trigger: string; triggerEn?: string; effect: string; effectEn?: string; }

@Component({
  selector: 'app-dashboard-layout-page',
  imports: [TyroUiPageHeader, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './dashboard-layout-page.html',
  styleUrl: './dashboard-layout-page.css',
})
export class DashboardLayoutPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '220px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  readonly fieldCols: ITyroUiDataTableColumn[] = [
    { key: 'field',       label: 'Champ',  labelEn: 'Field', width: '180px' },
    { key: 'type',        label: 'Type',                      width: '220px' },
    { key: 'description', label: 'Description' },
  ];

  readonly stateCols: ITyroUiDataTableColumn[] = [
    { key: 'state',   label: 'État',        labelEn: 'State',   width: '180px' },
    { key: 'trigger', label: 'Déclencheur', labelEn: 'Trigger', width: '260px' },
    { key: 'effect',  label: 'Effet',       labelEn: 'Effect' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[project]', type: 'string', default: "''",
      description:   'Nom du projet affiché dans la topbar et la sidebar (ex : <em>"Useritium"</em>)',
      descriptionEn: 'Project name displayed in the topbar and sidebar (e.g. <em>"Useritium"</em>)',
    },
    {
      prop: '[logo]', type: 'string', default: "''",
      description:   'URL du logo couleur affiché dans la topbar',
      descriptionEn: 'Color logo URL displayed in the topbar',
    },
    {
      prop: '[logoWhite]', type: 'string', default: "''",
      description:   'URL du logo blanc affiché dans la sidebar mobile',
      descriptionEn: 'White logo URL displayed in the mobile sidebar',
    },
    {
      prop: '[utility]', type: 'string', default: "''",
      description:   'Label utilitaire affiché sous le projet dans la sidebar (ex : <em>"Dashboard"</em>, <em>"Hub"</em>)',
      descriptionEn: 'Utility label displayed below the project name in the sidebar (e.g. <em>"Dashboard"</em>, <em>"Hub"</em>)',
    },
    {
      prop: '[requireLogin]', type: 'boolean', default: 'true',
      description:   'Redirige vers la page de connexion si l\'utilisateur n\'est pas authentifié via <code>TyroUiAuthService</code>',
      descriptionEn: 'Redirects to the login page if the user is not authenticated via <code>TyroUiAuthService</code>',
    },
    {
      prop: '[navItems]', type: 'ITyroUiDashNavItem[]', default: '[]',
      description:   'Arborescence de navigation affichée dans la sidebar (voir interfaces ci-dessous)',
      descriptionEn: 'Navigation tree displayed in the sidebar (see interfaces below)',
    },
  ];

  /* ─── ITyroUiDashNavItem ──────────────────────────── */

  readonly navItemData: FieldRow[] = [
    { field: 'label',      type: 'string',               description: 'Texte affiché dans la sidebar',                                    descriptionEn: 'Text displayed in the sidebar' },
    { field: 'icon',       type: 'string',               description: 'Classe remix-icon (utilisée si <code>iconImg</code> absent)',       descriptionEn: 'Remix-icon class (used if <code>iconImg</code> is absent)' },
    { field: 'iconImg?',   type: 'string',               description: 'URL image remplaçant l\'icône (logos projets, etc.)',               descriptionEn: 'Image URL replacing the icon (project logos, etc.)' },
    { field: 'link?',      type: 'string',               description: 'Route Angular — absent si groupe ou catégorie',                     descriptionEn: 'Angular route — omitted if group or category' },
    { field: 'category?',  type: 'boolean',              description: 'Transforme l\'item en section collapsible (pas un lien)',           descriptionEn: 'Turns the item into a collapsible section (not a link)' },
    { field: 'children?',  type: 'ITyroUiDashNavChild[]', description: 'Sous-items (niveau 2)',                                           descriptionEn: 'Sub-items (level 2)' },
    { field: 'open?',      type: 'boolean',              description: 'État ouvert/fermé du groupe ou de la catégorie',                    descriptionEn: 'Open/closed state of the group or category' },
  ];

  /* ─── ITyroUiDashNavChild ─────────────────────────── */

  readonly navChildData: FieldRow[] = [
    { field: 'label',     type: 'string',                  description: 'Texte affiché',                               descriptionEn: 'Displayed text' },
    { field: 'icon',      type: 'string',                  description: 'Classe remix-icon',                            descriptionEn: 'Remix-icon class' },
    { field: 'iconImg?',  type: 'string',                  description: 'URL image à la place de l\'icône',             descriptionEn: 'Image URL replacing the icon' },
    { field: 'link?',     type: 'string',                  description: 'Route — absent si sous-groupe',                descriptionEn: 'Route — omitted if sub-group' },
    { field: 'children?', type: 'ITyroUiDashNavSubItem[]', description: 'Sous-sous-items (niveau 3)',                   descriptionEn: 'Sub-sub-items (level 3)' },
    { field: 'open?',     type: 'boolean',                 description: 'État du sous-groupe',                          descriptionEn: 'Sub-group open state' },
  ];

  /* ─── ITyroUiDashNavSubItem ───────────────────────── */

  readonly navSubItemData: FieldRow[] = [
    { field: 'label',    type: 'string', description: 'Texte affiché',                         descriptionEn: 'Displayed text' },
    { field: 'icon',     type: 'string', description: 'Classe remix-icon',                      descriptionEn: 'Remix-icon class' },
    { field: 'iconImg?', type: 'string', description: 'URL image à la place de l\'icône',       descriptionEn: 'Image URL replacing the icon' },
    { field: 'link',     type: 'string', description: 'Route Angular (obligatoire au niveau 3)', descriptionEn: 'Angular route (required at level 3)' },
  ];

  /* ─── Comportement sidebar ────────────────────────── */

  readonly sidebarStateData: StateRow[] = [
    {
      state: 'Étendue (desktop)',     stateEn: 'Expanded (desktop)',
      trigger: 'Par défaut',          triggerEn: 'Default',
      effect: 'Sidebar 240px, labels visibles', effectEn: 'Sidebar 240px, labels visible',
    },
    {
      state: 'Réduite (desktop)',     stateEn: 'Collapsed (desktop)',
      trigger: 'Bouton chevron en haut de la sidebar', triggerEn: 'Chevron button at the top of the sidebar',
      effect: 'Sidebar 60px, icônes seules + tooltip au survol', effectEn: 'Sidebar 60px, icons only + hover tooltip',
    },
    {
      state: 'Ouverte (mobile)',      stateEn: 'Open (mobile)',
      trigger: 'Burger de la topbar', triggerEn: 'Topbar burger button',
      effect: 'Sidebar en overlay (<code>z-index: 1002</code>) par-dessus le contenu', effectEn: 'Sidebar as overlay (<code>z-index: 1002</code>) above the content',
    },
    {
      state: 'Fermée (mobile)',       stateEn: 'Closed (mobile)',
      trigger: 'Clic overlay · lien · bouton fermer · <kbd>Escape</kbd>', triggerEn: 'Overlay click · link · close button · <kbd>Escape</kbd>',
      effect: 'Sidebar repasse en <code>translateX(-100%)</code>', effectEn: 'Sidebar returns to <code>translateX(-100%)</code>',
    },
  ];
}
