import { Component, inject, signal } from '@angular/core';
import {
  TyroUiAlert, TyroUiButton, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-alert-page',
  imports: [TyroUiAlert, TyroUiButton, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './alert-page.html',
})
export class AlertPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly closed1 = signal(false);
  readonly closed2 = signal(false);

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[type]',      type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'",
      description: 'Style sémantique de l\'alerte', descriptionEn: 'Semantic style of the alert' },
    { prop: '[title]',     type: 'string', default: '—',
      description: 'Titre affiché en gras', descriptionEn: 'Bold title displayed' },
    { prop: '[message]',   type: 'string', default: '—',
      description: 'Message principal', descriptionEn: 'Main message text' },
    { prop: '[closable]',  type: 'boolean', default: 'true',
      description: 'Affiche le bouton ×', descriptionEn: 'Shows the × button' },
    { prop: '[(isClosed)]', type: 'boolean', default: 'false',
      description: 'État de fermeture — two-way binding', descriptionEn: 'Closed state — two-way binding' },
  ];
}
