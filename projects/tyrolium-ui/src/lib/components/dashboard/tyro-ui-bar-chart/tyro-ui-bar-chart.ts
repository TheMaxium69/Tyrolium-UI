import { Component, Input, computed, inject, signal } from '@angular/core';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';
import { ITyroUiBarChartItem } from '../../../interface/ityro-ui-bar-chart-item';

/** Nombre max de libellés sur l'axe X : au-delà, on n'en affiche qu'un sur N. */
const MAX_X_LABELS = 8;
const Y_TICKS      = 4;

/**
 * Diagramme en barres verticales, une série. Une seule couleur (pas de légende :
 * le titre de la carte nomme la série), grille discrète, infobulle par barre
 * au survol et au focus clavier.
 */
@Component({
  selector: 'tyro-ui-bar-chart',
  templateUrl: './tyro-ui-bar-chart.html',
  styleUrl: './tyro-ui-bar-chart.css',
})
export class TyroUiBarChart {
  private readonly _items = signal<ITyroUiBarChartItem[]>([]);
  @Input() set items(value: ITyroUiBarChartItem[] | null | undefined) { this._items.set(value ?? []); }
  get items() { return this._items(); }

  /** Nom de la valeur dans l'infobulle (ex. "Visites"). */
  @Input() valueLabel = '';
  /** Hauteur de la zone de tracé, en px. */
  @Input() height = 220;
  /** Message affiché quand toutes les valeurs sont à 0 ou qu'il n'y a pas de données. */
  @Input() emptyLabel?: string;

  readonly lang = inject(TyroUiLangService).lang;

  readonly hovered = signal<number | null>(null);

  /** Max "propre" de l'axe Y (1, 2, 2.5, 5 × 10ⁿ) pour des graduations rondes. */
  readonly axisMax = computed(() => {
    const max = Math.max(0, ...this._items().map(i => i.value));
    if (max <= 0) return Y_TICKS;
    const rough = max / Y_TICKS;
    const pow   = 10 ** Math.floor(Math.log10(rough));
    const step  = [1, 2, 2.5, 5, 10].map(m => m * pow).find(s => s >= rough) ?? 10 * pow;
    return Math.max(Y_TICKS, Math.ceil(step) * Y_TICKS);
  });

  readonly ticks = computed(() => {
    const max = this.axisMax();
    return Array.from({ length: Y_TICKS + 1 }, (_, i) => (max / Y_TICKS) * (Y_TICKS - i));
  });

  readonly bars = computed(() => {
    const items = this._items();
    const max   = this.axisMax();
    const every = Math.max(1, Math.ceil(items.length / MAX_X_LABELS));
    return items.map((item, index) => ({
      ...item,
      percent:   (item.value / max) * 100,
      showLabel: index % every === 0,
    }));
  });

  readonly isEmpty = computed(() => !this._items().some(i => i.value > 0));

  /** Infobulle ancrée à gauche ou à droite selon la position de la barre, pour ne pas déborder. */
  tooltipSide(index: number): 'left' | 'right' | 'center' {
    const n = this._items().length;
    if (index < n * 0.2) return 'left';
    if (index > n * 0.8) return 'right';
    return 'center';
  }

  format(value: string | number): string {
    return typeof value === 'number'
      ? value.toLocaleString(this.lang() === 'en' ? 'en-GB' : 'fr-FR')
      : value;
  }

  ariaLabel(item: ITyroUiBarChartItem): string {
    const details = (item.details ?? []).map(d => `${d.label} ${this.format(d.value)}`).join(', ');
    return `${item.label} : ${this.format(item.value)} ${this.valueLabel}${details ? ', ' + details : ''}`;
  }
}
