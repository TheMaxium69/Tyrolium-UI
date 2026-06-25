import { Component, computed, inject, signal } from '@angular/core';
import {
  TyroUiButtonGroup,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
  ITyroUiButtonGroupItem,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface EventRow { event: string; payload: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-button-group-page',
  imports: [TyroUiButtonGroup, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './button-group-page.html',
})
export class ButtonGroupPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── États des previews ──────────────────────────── */

  readonly activeLite      = signal('all');
  readonly activeClassic   = signal('week');
  readonly activeGradient  = signal('month');
  readonly activeIcons     = signal('grid');
  readonly activeFive      = signal('b');

  /* ─── Items bilingues via computed ───────────────── */

  readonly filterItems = computed<ITyroUiButtonGroupItem[]>(() => {
    const en = this.lang() === 'en';
    return [
      { value: 'all',      label: en ? 'All'      : 'Tous' },
      { value: 'active',   label: en ? 'Active'   : 'Actif' },
      { value: 'inactive', label: en ? 'Inactive' : 'Inactif' },
    ];
  });

  readonly periodItems = computed<ITyroUiButtonGroupItem[]>(() => {
    const en = this.lang() === 'en';
    return [
      { value: 'day',   label: en ? 'Day'   : 'Jour' },
      { value: 'week',  label: en ? 'Week'  : 'Semaine' },
      { value: 'month', label: en ? 'Month' : 'Mois' },
      { value: 'year',  label: en ? 'Year'  : 'Année' },
    ];
  });

  readonly iconItems: ITyroUiButtonGroupItem[] = [
    { value: 'grid',  icon: 'ri-grid-line',        label: '' },
    { value: 'list',  icon: 'ri-list-unordered',   label: '' },
    { value: 'table', icon: 'ri-table-line',        label: '' },
  ];

  readonly fiveItems = computed<ITyroUiButtonGroupItem[]>(() => {
    const en = this.lang() === 'en';
    return [
      { value: 'a', label: en ? 'Alpha'   : 'Alpha' },
      { value: 'b', label: en ? 'Beta'    : 'Bêta' },
      { value: 'c', label: en ? 'Gamma'   : 'Gamma' },
      { value: 'd', label: en ? 'Delta'   : 'Delta' },
      { value: 'e', label: en ? 'Epsilon' : 'Epsilon' },
    ];
  });

  /* ─── Columns ─────────────────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '160px' },
    { key: 'type',        label: 'Type',                             width: '260px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '110px' },
    { key: 'description', label: 'Description' },
  ];

  readonly eventCols: ITyroUiDataTableColumn[] = [
    { key: 'event',       label: 'Événement',  labelEn: 'Event',    width: '160px' },
    { key: 'payload',     label: 'Payload',                          width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs data ─────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[items]', type: 'ITyroUiButtonGroupItem[]', default: '[]',
      description:   'Liste des boutons à afficher (value, label, icon?, disabled?)',
      descriptionEn: 'List of buttons to display (value, label, icon?, disabled?)',
    },
    {
      prop: '[(value)]', type: 'string', default: '-',
      description:   'Valeur du bouton actif - two-way binding disponible',
      descriptionEn: 'Active button value - two-way binding available',
    },
    {
      prop: '[variant]', type: "'lite' | 'classic' | 'gradient'", default: "'lite'",
      description:   'Style visuel du groupe',
      descriptionEn: 'Visual style of the group',
    },
    {
      prop: '[size]', type: "'sm' | 'md' | 'lg'", default: "'md'",
      description:   'Taille des boutons du groupe',
      descriptionEn: 'Size of the buttons in the group',
    },
  ];

  readonly outputsData: EventRow[] = [
    {
      event: '(valueChange)', payload: 'string',
      description:   'Émis quand l\'utilisateur sélectionne un bouton - fournit la value de l\'item',
      descriptionEn: 'Emitted when the user selects a button - provides the item\'s value',
    },
  ];
}
