import { Component, inject } from '@angular/core';
import {
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-page-header-page',
  imports: [TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './page-header-page.html',
})
export class PageHeaderPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '160px' },
    { key: 'type',        label: 'Type',                             width: '120px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[title]', type: 'string', default: "''",
      description:   'Titre principal affiché en grand',
      descriptionEn: 'Main title displayed in large font',
    },
    {
      prop: '[label?]', type: 'string', default: '—',
      description:   'Surtitre affiché au-dessus du titre (ex : <em>"&lt;tyro-ui-navbar&gt;"</em>)',
      descriptionEn: 'Eyebrow label displayed above the title (e.g. <em>"&lt;tyro-ui-navbar&gt;"</em>)',
    },
  ];
}
