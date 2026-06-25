import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TyroUiAlertType = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'tyro-ui-alert',
  templateUrl: './tyro-ui-alert.html',
  styleUrl: './tyro-ui-alert.css',
})
export class TyroUiAlert {
  @Input() type:     TyroUiAlertType = 'info';
  @Input() title?:   string;
  @Input() message?: string;
  @Input() closable  = true;
  @Input() isClosed  = false;

  @Output() isClosedChange = new EventEmitter<boolean>();

  readonly icons: Record<TyroUiAlertType, string> = {
    info:    'ri-information-line',
    success: 'ri-checkbox-circle-line',
    warning: 'ri-error-warning-line',
    danger:  'ri-close-circle-line',
  };

  get icon(): string { return this.icons[this.type]; }

  close(): void {
    this.isClosed = true;
    this.isClosedChange.emit(true);
  }
}
