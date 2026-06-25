import { Component, inject, signal } from '@angular/core';
import {
  TyroUiSwitch,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface EventRow { event: string; payload: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-switch-page',
  imports: [TyroUiSwitch, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './switch-page.html',
})
export class SwitchPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly sw1 = signal(false);
  readonly sw2 = signal(true);
  readonly sw3 = signal(false);

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '150px' },
    { key: 'type',        label: 'Type',                             width: '120px' },
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
      prop: '[(value)]', type: 'boolean', default: 'false',
      description:   'État du switch - two-way binding disponible',
      descriptionEn: 'Switch state - two-way binding available',
    },
    {
      prop: '[disabled]', type: 'boolean', default: 'false',
      description:   'Désactive le switch',
      descriptionEn: 'Disables the switch',
    },
    {
      prop: '[label]', type: 'string', default: '-',
      description:   'Texte affiché à droite du switch',
      descriptionEn: 'Text displayed to the right of the switch',
    },
  ];

  readonly outputsData: EventRow[] = [
    {
      event: '(valueChange)', payload: 'boolean',
      description:   'Émis à chaque changement d\'état',
      descriptionEn: 'Emitted on every state change',
    },
  ];
}
