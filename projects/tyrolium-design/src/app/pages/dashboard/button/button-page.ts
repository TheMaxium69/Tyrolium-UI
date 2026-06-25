import { Component, inject } from '@angular/core';
import {
  TyroUiButton,
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
  selector: 'app-button-page',
  imports: [TyroUiButton, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './button-page.html',
})
export class ButtonPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '160px' },
    { key: 'type',        label: 'Type',                             width: '230px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '110px' },
    { key: 'description', label: 'Description' },
  ];

  readonly eventCols: ITyroUiDataTableColumn[] = [
    { key: 'event',       label: 'Événement',  labelEn: 'Event',    width: '140px' },
    { key: 'payload',     label: 'Payload',                          width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    {
      prop: '[variant]', type: "'classic' | 'lite' | 'gradient' | 'ghost'", default: "'classic'",
      description:   'Style visuel du bouton',
      descriptionEn: 'Visual style of the button',
    },
    {
      prop: '[size]', type: "'sm' | 'md' | 'lg'", default: "'md'",
      description:   'Taille du bouton',
      descriptionEn: 'Size of the button',
    },
    {
      prop: '[icon]', type: 'string', default: '—',
      description:   'Classe Remix Icon affichée à gauche du texte',
      descriptionEn: 'Remix Icon class displayed to the left of the label',
    },
    {
      prop: '[iconRight]', type: 'string', default: '—',
      description:   'Classe Remix Icon affichée à droite du texte',
      descriptionEn: 'Remix Icon class displayed to the right of the label',
    },
    {
      prop: '[disabled]', type: 'boolean', default: 'false',
      description:   'Désactive le bouton (opacité réduite, curseur interdit)',
      descriptionEn: 'Disables the button (reduced opacity, not-allowed cursor)',
    },
    {
      prop: '[type]', type: "'button' | 'submit' | 'reset'", default: "'button'",
      description:   'Attribut HTML type du bouton natif',
      descriptionEn: 'HTML type attribute of the native button',
    },
  ];

  readonly outputsData: EventRow[] = [
    {
      event: '(clicked)', payload: 'void',
      description:   'Émis au clic (ignoré si disabled)',
      descriptionEn: 'Emitted on click (ignored when disabled)',
    },
  ];
}
