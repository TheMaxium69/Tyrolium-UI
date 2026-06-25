export interface ITyroUiSnackbarConfig {
  message:    string;
  title?:     string;
  icon?:      string;
  type?:      'default' | 'success' | 'warning' | 'danger';
  position?:  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?:  number; /* ms — 0 = pas d'auto-fermeture */
}
