import { Component, inject, signal } from '@angular/core';
import {
  TyroUiProgressBar, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-progress-bar-page',
  imports: [TyroUiProgressBar, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './progress-bar-page.html',
})
export class ProgressBarPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '110px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[variant]',    type: "'simple' | 'lite' | 'gradient'", default: "'simple'",
      description: 'Style visuel de la barre', descriptionEn: 'Visual style of the bar' },
    { prop: '[value]',      type: 'number (0–100)', default: '0',
      description: 'Progression en pourcentage', descriptionEn: 'Progress percentage' },
    { prop: '[color]',      type: 'string (hex)', default: "'#0533c8'",
      description: 'Couleur de remplissage (simple + lite)', descriptionEn: 'Fill color (simple + lite)' },
    { prop: '[label]',      type: 'string', default: '—',
      description: 'Texte affiché au-dessus', descriptionEn: 'Text displayed above' },
    { prop: '[showLabel]',  type: 'boolean', default: 'false',
      description: 'Affiche le pourcentage en haut à droite', descriptionEn: 'Shows percentage top-right' },
    { prop: '[height]',     type: 'string (CSS)', default: "'8px'",
      description: 'Hauteur de la barre', descriptionEn: 'Height of the bar' },
  ];
}
