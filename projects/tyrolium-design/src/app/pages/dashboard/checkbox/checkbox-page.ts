import { Component, inject, signal } from '@angular/core';
import {
  TyroUiCheckbox, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-checkbox-page',
  imports: [TyroUiCheckbox, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './checkbox-page.html',
})
export class CheckboxPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly cbA = signal(false);
  readonly cbB = signal(true);
  readonly cbC = signal(false);
  readonly cbD = signal(true);

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '160px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '90px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[(value)]',  type: 'boolean', default: 'false',
      description: 'État coché - two-way binding', descriptionEn: 'Checked state - two-way binding' },
    { prop: '[label]',    type: 'string',  default: '-',
      description: 'Texte affiché à droite', descriptionEn: 'Text displayed on the right' },
    { prop: '[disabled]', type: 'boolean', default: 'false',
      description: 'Désactive l\'interaction', descriptionEn: 'Disables interaction' },
  ];
}
