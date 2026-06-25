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
  selector: 'app-bento-card-page',
  imports: [TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './bento-card-page.html',
})
export class BentoCardPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '200px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '90px'  },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[title?]', type: 'string', default: '—',
      description:   'Titre affiché dans le header de la carte',
      descriptionEn: 'Title displayed in the card header',
    },
    {
      prop: '[label?]', type: 'string', default: '—',
      description:   'Surtitre affiché au-dessus du titre (en majuscules)',
      descriptionEn: 'Eyebrow label displayed above the title (uppercase)',
    },
    {
      prop: '[icon?]', type: 'string', default: '—',
      description:   'Classe remix-icon affichée dans le header',
      descriptionEn: 'Remix-icon class displayed in the header',
    },
    {
      prop: '[iconImg?]', type: 'string', default: '—',
      description:   'URL image remplaçant l\'icône dans le header',
      descriptionEn: 'Image URL replacing the icon in the header',
    },
    {
      prop: '[size]', type: "'small' | 'medium' | 'large'", default: "'medium'",
      description:   'Taille de la carte — affecte le padding et les gaps internes',
      descriptionEn: 'Card size — affects padding and internal gaps',
    },
    {
      prop: '[hoverable]', type: 'boolean', default: 'false',
      description:   'Active l\'effet hover (ombre + léger translateY)',
      descriptionEn: 'Enables hover effect (shadow + slight translateY)',
    },
    {
      prop: '[gradient]', type: 'boolean', default: 'false',
      description:   'Active la bordure gradient animée Tyrolium au survol',
      descriptionEn: 'Enables the animated Tyrolium gradient border on hover',
    },
  ];
}
