import { Component, inject } from '@angular/core';
import {
  TyroUiButton, TyroUiButtonGroup, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
  TyroUiSnackbarService, ITyroUiSnackbarConfig, ITyroUiButtonGroupItem,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-snackbar-page',
  imports: [TyroUiButton, TyroUiButtonGroup, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './snackbar-page.html',
})
export class SnackbarPage {
  readonly lang = inject(TyroUiLangService).lang;
  private readonly snackbar = inject(TyroUiSnackbarService);

  readonly positionItems: ITyroUiButtonGroupItem[] = [
    { value: 'top-left',     label: 'Top Left' },
    { value: 'top-right',    label: 'Top Right' },
    { value: 'bottom-left',  label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  selectedPos = 'bottom-right';

  show(config: ITyroUiSnackbarConfig): void {
    this.snackbar.show({
      ...config,
      position: this.selectedPos as ITyroUiSnackbarConfig['position'],
    });
  }

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '220px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '120px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: 'message',   type: 'string',   default: '-',
      description: 'Texte principal (obligatoire)', descriptionEn: 'Main text (required)' },
    { prop: 'title',     type: 'string',   default: '-',
      description: 'Titre affiché en gras', descriptionEn: 'Bold title' },
    { prop: 'icon',      type: 'string (Remix Icon)', default: '-',
      description: 'Icône - si vide, icône par défaut selon le type', descriptionEn: 'Icon - defaults to type icon if empty' },
    { prop: 'type',      type: "'default' | 'success' | 'warning' | 'danger'", default: "'default'",
      description: 'Couleur accentuée du bandeau et de l\'icône', descriptionEn: 'Accent color for the left border and icon' },
    { prop: 'position',  type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", default: "'bottom-right'",
      description: 'Coin de la fenêtre où la snackbar apparaît', descriptionEn: 'Window corner where the snackbar appears' },
    { prop: 'duration',  type: 'number (ms)', default: '4000',
      description: '0 = ne se ferme pas automatiquement', descriptionEn: '0 = no auto-close' },
  ];
}
