import { Component, inject } from '@angular/core';
import {
  TyroUiButtonBento,
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
  selector: 'app-button-bento-page',
  imports: [TyroUiButtonBento, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './button-bento-page.html',
})
export class ButtonBentoPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '200px' },
    { key: 'type',        label: 'Type',                             width: '160px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[label]', type: 'string', default: "''",
      description:   'Titre principal du bouton',
      descriptionEn: 'Main button title',
    },
    {
      prop: '[sublabel?]', type: 'string', default: '-',
      description:   'Sous-titre affiché sous le label',
      descriptionEn: 'Subtitle displayed below the label',
    },
    {
      prop: '[icon]', type: 'string', default: "''",
      description:   'Classe remix-icon affichée dans le bouton',
      descriptionEn: 'Remix-icon class displayed in the button',
    },
    {
      prop: '[iconImg?]', type: 'string', default: '-',
      description:   'URL image remplaçant l\'icône',
      descriptionEn: 'Image URL replacing the icon',
    },
    {
      prop: '[tag?]', type: 'string', default: '-',
      description:   'Badge texte affiché en haut à droite du bouton',
      descriptionEn: 'Text badge displayed at the top right of the button',
    },
    {
      prop: '[short]', type: 'boolean', default: 'false',
      description:   'Version compacte horizontale (icône + label sur une ligne)',
      descriptionEn: 'Compact horizontal layout (icon + label on one line)',
    },
    {
      prop: '[gradient]', type: 'boolean', default: 'false',
      description:   'Active la bordure animée gradient Tyrolium au survol',
      descriptionEn: 'Enables the animated Tyrolium gradient border on hover',
    },
    {
      prop: '[link?]', type: 'string', default: '-',
      description:   'Route Angular (<code>routerLink</code>)',
      descriptionEn: 'Angular route (<code>routerLink</code>)',
    },
    {
      prop: '[href?]', type: 'string', default: '-',
      description:   'Lien externe (ouvre dans le même onglet)',
      descriptionEn: 'External link (opens in the same tab)',
    },
  ];
}
