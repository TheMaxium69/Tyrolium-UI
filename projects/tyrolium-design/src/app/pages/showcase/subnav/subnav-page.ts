import { Component, computed, inject } from '@angular/core';
import {
  TyroUiSubnav,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  ITyroUiNavbarPages,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface FieldRow { field: string; type: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-subnav-page',
  imports: [TyroUiSubnav, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './subnav-page.html',
})
export class SubnavPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly samplePages = computed<ITyroUiNavbarPages[]>(() => {
    const en = this.lang() === 'en';
    return [
      { label: en ? 'Overview'      : 'Présentation',   link: '.' },
      { label: en ? 'Features'      : 'Fonctionnalités', href: '/showcase/subnav/#' },
      { label: en ? 'Pricing'       : 'Tarifs',          href: '/showcase/subnav/#' },
      { label: en ? 'Docs'          : 'Documentation',   href: '/showcase/subnav/#' },
    ];
  });

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '200px' },
    { key: 'type',        label: 'Type',                             width: '180px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '90px'  },
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
      prop: '[pages]', type: 'ITyroUiNavbarPages[]', default: '[]',
      description:   'Liste des onglets de navigation (même interface que <code>tyro-ui-navbar</code>)',
      descriptionEn: 'List of navigation tabs (same interface as <code>tyro-ui-navbar</code>)',
    },
    {
      prop: '[isFixed]', type: 'boolean', default: 'false',
      description:   'Passe la subnav en <code>position: fixed</code> pour rester collée sous la navbar principale',
      descriptionEn: 'Switches the subnav to <code>position: fixed</code> to stay pinned below the main navbar',
    },
    {
      prop: '[havePlaceholder]', type: 'boolean', default: 'true',
      description:   'Affiche un placeholder pour compenser la hauteur quand <code>[isFixed]="true"</code>',
      descriptionEn: 'Renders a placeholder to compensate for the height when <code>[isFixed]="true"</code>',
    },
  ];

  /* ─── Interface ITyroUiNavbarPages ────────────────── */

  readonly pagesInterfaceData: FieldRow[] = [
    { field: 'label',      type: 'string',               description: "Texte de l'onglet (fr)",                              descriptionEn: 'Tab text (fr)' },
    { field: 'labelEn?',   type: 'string',               description: "Texte de l'onglet (en)",                              descriptionEn: 'Tab text (en)' },
    { field: 'link?',      type: 'string',               description: 'Route Angular (<code>routerLink</code> + <code>routerLinkActive</code>)', descriptionEn: 'Angular route (<code>routerLink</code> + <code>routerLinkActive</code>)' },
    { field: 'href?',      type: 'string',               description: 'Lien externe',                                        descriptionEn: 'External link' },
    { field: 'ancre?',     type: 'string',               description: "ID de l'élément vers lequel scroller",               descriptionEn: 'ID of the element to scroll to' },
    { field: 'icon?',      type: 'string',               description: 'Classe remix-icon affichée avant le label',           descriptionEn: 'Remix-icon class displayed before the label' },
    { field: 'children?',  type: 'ITyroUiNavbarPages[]', description: 'Sous-onglets (dropdown)',                             descriptionEn: 'Sub-tabs (dropdown)' },
  ];
}
