import { Component, inject } from '@angular/core';
import {
  TyroUiCTA,
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
  selector: 'app-cta-page',
  imports: [TyroUiCTA, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './cta-page.html',
})
export class CtaPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '200px' },
    { key: 'type',        label: 'Type',                             width: '100px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[title]', type: 'string', default: "''",
      description:   'Titre principal de la section',
      descriptionEn: 'Main section title',
    },
    {
      prop: '[label]', type: 'string', default: "''",
      description:   'Label affiché au-dessus du titre (surtitre)',
      descriptionEn: 'Label displayed above the title (eyebrow text)',
    },
    {
      prop: '[content]', type: 'string', default: "''",
      description:   'Texte descriptif affiché sous le titre',
      descriptionEn: 'Descriptive text displayed below the title',
    },
    {
      prop: '[btn]', type: 'string', default: "''",
      description:   'Texte du bouton principal',
      descriptionEn: 'Primary button text',
    },
    {
      prop: '[btnIcon]', type: 'string', default: "''",
      description:   'Classe remix-icon du bouton principal',
      descriptionEn: 'Remix-icon class for the primary button',
    },
    {
      prop: '[btnLink]', type: 'string', default: "''",
      description:   'Lien externe (<code>href</code>) du bouton principal',
      descriptionEn: 'External link (<code>href</code>) for the primary button',
    },
    {
      prop: '[btnRouterLink]', type: 'string', default: "''",
      description:   'Route Angular du bouton principal',
      descriptionEn: 'Angular route for the primary button',
    },
    {
      prop: '[subbtn]', type: 'string', default: "''",
      description:   'Texte du bouton secondaire',
      descriptionEn: 'Secondary button text',
    },
    {
      prop: '[subLink]', type: 'string', default: "''",
      description:   'Lien externe du bouton secondaire',
      descriptionEn: 'External link for the secondary button',
    },
    {
      prop: '[subRouterLink]', type: 'string', default: "''",
      description:   'Route Angular du bouton secondaire',
      descriptionEn: 'Angular route for the secondary button',
    },
    {
      prop: '[subAncreLink]', type: 'string', default: "''",
      description:   "ID de l'ancre vers laquelle scroller (bouton secondaire)",
      descriptionEn: 'Anchor ID to scroll to (secondary button)',
    },
    {
      prop: '[notBack]', type: 'boolean', default: 'false',
      description:   "Supprime l'image de fond / l'arrière-plan décoratif",
      descriptionEn: 'Removes the background image / decorative backdrop',
    },
    {
      prop: '[vturias]', type: 'boolean', default: 'false',
      description:   'Active le thème visuel Vturias',
      descriptionEn: 'Enables the Vturias visual theme',
    },
  ];
}
