import { Component, inject } from '@angular/core';
import {
  TyroUiSkeleton, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-skeleton-page',
  imports: [TyroUiSkeleton, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './skeleton-page.html',
})
export class SkeletonPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '160px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[variant]',      type: "'rect' | 'text' | 'circle'", default: "'rect'",
      description: 'Forme prédéfinie', descriptionEn: 'Predefined shape' },
    { prop: '[width]',        type: 'string (CSS)',  default: "'100%'",
      description: 'Largeur de l\'élément', descriptionEn: 'Element width' },
    { prop: '[height]',       type: 'string (CSS)',  default: "'16px'",
      description: 'Hauteur de l\'élément', descriptionEn: 'Element height' },
    { prop: '[borderRadius]', type: 'string (CSS)',  default: '-',
      description: 'Border radius - surcharge le variant', descriptionEn: 'Border radius - overrides variant default' },
    { prop: '[count]',        type: 'number',        default: '1',
      description: 'Nombre de lignes répétées', descriptionEn: 'Number of repeated rows' },
  ];
}
