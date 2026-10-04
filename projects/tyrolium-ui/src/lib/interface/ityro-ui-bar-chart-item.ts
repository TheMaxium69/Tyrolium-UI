/** Une barre de tyro-ui-bar-chart. */
export interface ITyroUiBarChartItem {
  /** Libellé de l'axe X (ex. "04 oct."). */
  label:    string;
  value:    number;
  /** Lignes supplémentaires de l'infobulle (ex. { label: 'Uniques', value: 17 }). */
  details?: { label: string; value: string | number }[];
}
