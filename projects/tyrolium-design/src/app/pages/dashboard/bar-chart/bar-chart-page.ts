import { Component, computed, inject } from '@angular/core';
import {
  TyroUiBarChart, ITyroUiBarChartItem, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-bar-chart-page',
  imports: [TyroUiBarChart, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './bar-chart-page.html',
})
export class BarChartPage {
  readonly lang = inject(TyroUiLangService).lang;

  /** 30 jours de visites fictives. */
  readonly visits = computed<ITyroUiBarChartItem[]>(() => {
    const locale = this.lang() === 'en' ? 'en-GB' : 'fr-FR';
    return Array.from({ length: 30 }, (_, i) => {
      const day = new Date(2026, 8, 5 + i);
      const value = i % 9 === 4 ? 0 : Math.round(40 + 30 * Math.sin(i / 3) + (i % 7 === 0 ? 50 : 0) + i * 2);
      return {
        label:   day.toLocaleDateString(locale, { day: '2-digit', month: 'short' }),
        value,
        details: [{ label: this.lang() === 'en' ? 'unique visitors' : 'visiteurs uniques', value: Math.round(value * 0.6) }],
      };
    });
  });

  readonly months = computed<ITyroUiBarChartItem[]>(() => {
    const en = this.lang() === 'en';
    const names = en ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] : ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin'];
    return [1240, 1580, 1320, 2100, 2480, 2950].map((value, i) => ({ label: names[i], value }));
  });

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '150px' },
    { key: 'type',        label: 'Type',                             width: '220px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[items]', type: 'ITyroUiBarChartItem[]', default: '[]',
      description: 'Barres : <code>{ label, value, details? }</code>. <code>details</code> ajoute des lignes à l\'infobulle (<code>{ label, value }</code>).',
      descriptionEn: 'Bars: <code>{ label, value, details? }</code>. <code>details</code> adds rows to the tooltip (<code>{ label, value }</code>).' },
    { prop: '[valueLabel]', type: 'string', default: "''",
      description: 'Nom de la valeur dans l\'infobulle (ex. "visites")', descriptionEn: 'Value name in the tooltip (e.g. "visits")' },
    { prop: '[height]', type: 'number', default: '220',
      description: 'Hauteur de la zone de tracé en px', descriptionEn: 'Plot area height in px' },
    { prop: '[emptyLabel]', type: 'string', default: "'Aucune donnée'",
      description: 'Message quand toutes les valeurs sont à 0', descriptionEn: 'Message when every value is 0' },
  ];

  readonly rulesFr = [
    'Une seule série, donc une seule couleur et pas de légende : le titre de la carte nomme la série.',
    'Barres de 24px max, arrondies seulement en haut, 2px d\'écart entre elles.',
    'Axe Y en graduations rondes (1, 2, 2.5, 5 × 10ⁿ), grille discrète.',
    'Au-delà de 8 barres, un libellé X sur N pour éviter les chevauchements.',
    'Infobulle par barre au survol et au focus clavier (colonne entière = cible).',
  ];
  readonly rulesEn = [
    'A single series, so one colour and no legend: the card title names the series.',
    'Bars 24px max, rounded at the top only, 2px apart.',
    'Y axis with round ticks (1, 2, 2.5, 5 × 10ⁿ), subtle grid.',
    'Beyond 8 bars, one X label out of N to avoid overlaps.',
    'One tooltip per bar on hover and keyboard focus (the whole column is the target).',
  ];

  readonly usageCode =
`<tyro-ui-bar-chart
  [items]="days()"
  valueLabel="visites"
  emptyLabel="Aucune visite sur cette période.">
</tyro-ui-bar-chart>

// days = [{ label: '04 oct.', value: 114, details: [{ label: 'uniques', value: 17 }] }, ...]`;
}
