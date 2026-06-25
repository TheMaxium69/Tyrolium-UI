import { Component, inject } from '@angular/core';
import {
  TyroUiChip,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow    { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface EventRow   { event: string; payload: string; description: string; descriptionEn?: string; }
interface VariantRow { variant: string; usage: string; usageEn?: string; }

@Component({
  selector: 'app-chip-page',
  imports: [TyroUiChip, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './chip-page.html',
})
export class ChipPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '160px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '120px' },
    { key: 'description', label: 'Description' },
  ];

  readonly eventCols: ITyroUiDataTableColumn[] = [
    { key: 'event',       label: 'Événement',  labelEn: 'Event',    width: '140px' },
    { key: 'payload',     label: 'Payload',                          width: '120px' },
    { key: 'description', label: 'Description' },
  ];

  readonly variantCols: ITyroUiDataTableColumn[] = [
    { key: 'variant', label: 'Variante', labelEn: 'Variant', width: '120px' },
    { key: 'usage',   label: 'Usage' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[variant]', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'",
      description:   'Couleur sémantique du chip',
      descriptionEn: 'Semantic color of the chip',
    },
    {
      prop: '[size]', type: "'sm' | 'md'", default: "'md'",
      description:   'Taille du chip',
      descriptionEn: 'Size of the chip',
    },
    {
      prop: '[icon]', type: 'string', default: '-',
      description:   'Classe d\'icône Remix Icon affichée à gauche du texte',
      descriptionEn: 'Remix Icon class displayed to the left of the text',
    },
    {
      prop: '[removable]', type: 'boolean', default: 'false',
      description:   'Affiche un bouton × pour supprimer le chip',
      descriptionEn: 'Shows a × button to remove the chip',
    },
  ];

  /* ─── Outputs ─────────────────────────────────────── */

  readonly outputsData: EventRow[] = [
    {
      event: '(removed)', payload: 'void',
      description:   'Émis quand l\'utilisateur clique sur le bouton de suppression',
      descriptionEn: 'Emitted when the user clicks the remove button',
    },
  ];

  /* ─── Variants ─────────────────────────────────────── */

  readonly variantsData: VariantRow[] = [
    { variant: 'default', usage: 'État neutre, tags génériques',              usageEn: 'Neutral state, generic tags' },
    { variant: 'accent',  usage: 'Rôle, catégorie, valeur mise en avant',    usageEn: 'Role, category, highlighted value' },
    { variant: 'success', usage: 'État actif, validé, en ligne',             usageEn: 'Active, validated, online state' },
    { variant: 'warning', usage: 'Avertissement, en attente',                usageEn: 'Warning, pending state' },
    { variant: 'danger',  usage: 'Erreur, inactif, bloqué',                  usageEn: 'Error, inactive, blocked state' },
  ];
}
