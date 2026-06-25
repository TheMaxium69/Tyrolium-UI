export interface ITyroUiConfirmConfig {
  title:           string;
  message:         string;
  icon?:           string;
  confirmLabel?:   string;
  cancelLabel?:    string;
  type?:           'default' | 'danger';
}
