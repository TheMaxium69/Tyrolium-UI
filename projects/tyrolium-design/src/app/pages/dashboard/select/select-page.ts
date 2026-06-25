import { Component, computed, inject, signal } from '@angular/core';
import {
  TyroUiSelect,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
  ITyroUiSelectItem,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface EventRow { event: string; payload: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-select-page',
  imports: [TyroUiSelect, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './select-page.html',
})
export class SelectPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly valNormal  = signal<string | undefined>(undefined);
  readonly valLite    = signal<string | undefined>('fr');
  readonly valIcons   = signal<string | undefined>(undefined);
  readonly valPreset  = signal<string>('active');

  /* ─── Items bilingues via computed ───────────────── */

  readonly statusItems = computed<ITyroUiSelectItem[]>(() => {
    const en = this.lang() === 'en';
    return [
      { value: 'active',   label: en ? 'Active'   : 'Actif' },
      { value: 'inactive', label: en ? 'Inactive' : 'Inactif' },
      { value: 'pending',  label: en ? 'Pending'  : 'En attente' },
    ];
  });

  readonly langItems = computed<ITyroUiSelectItem[]>(() => {
    const en = this.lang() === 'en';
    return [
      { value: 'fr', label: en ? 'French'  : 'Français' },
      { value: 'en', label: en ? 'English' : 'Anglais' },
      { value: 'es', label: en ? 'Spanish' : 'Espagnol' },
      { value: 'de', label: en ? 'German'  : 'Allemand' },
    ];
  });

  readonly iconItems: ITyroUiSelectItem[] = [
    { value: 'user',    label: 'Utilisateur / User',  icon: 'ri-user-line' },
    { value: 'admin',   label: 'Administrateur / Admin', icon: 'ri-shield-user-line' },
    { value: 'guest',   label: 'Invité / Guest',      icon: 'ri-user-shared-line' },
  ];

  /* ─── Columns ─────────────────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '170px' },
    { key: 'type',        label: 'Type',                             width: '220px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly eventCols: ITyroUiDataTableColumn[] = [
    { key: 'event',       label: 'Événement',  labelEn: 'Event',    width: '160px' },
    { key: 'payload',     label: 'Payload',                          width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    {
      prop: '[items]', type: 'ITyroUiSelectItem[]', default: '[]',
      description:   'Liste des options (value, label, icon?)',
      descriptionEn: 'List of options (value, label, icon?)',
    },
    {
      prop: '[(value)]', type: 'string | undefined', default: 'undefined',
      description:   'Valeur sélectionnée — undefined = aucune sélection (placeholder)',
      descriptionEn: 'Selected value — undefined = no selection (placeholder shown)',
    },
    {
      prop: '[placeholder]', type: 'string', default: "'—'",
      description:   'Texte affiché quand aucune option n\'est sélectionnée',
      descriptionEn: 'Text shown when no option is selected',
    },
    {
      prop: '[variant]', type: "'normal' | 'lite'", default: "'normal'",
      description:   'Style visuel du select',
      descriptionEn: 'Visual style of the select',
    },
    {
      prop: '[disabled]', type: 'boolean', default: 'false',
      description:   'Désactive le select',
      descriptionEn: 'Disables the select',
    },
  ];

  readonly outputsData: EventRow[] = [
    {
      event: '(valueChange)', payload: 'string',
      description:   'Émis quand l\'utilisateur sélectionne une option',
      descriptionEn: 'Emitted when the user selects an option',
    },
  ];
}
