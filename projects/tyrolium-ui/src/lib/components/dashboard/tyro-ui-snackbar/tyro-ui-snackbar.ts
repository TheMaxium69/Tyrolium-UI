import { Component, inject } from '@angular/core';
import { TyroUiSnackbarService } from './tyro-ui-snackbar.service';

@Component({
  selector: 'tyro-ui-snackbar',
  templateUrl: './tyro-ui-snackbar.html',
  styleUrl: './tyro-ui-snackbar.css',
})
export class TyroUiSnackbar {
  readonly svc = inject(TyroUiSnackbarService);

  readonly defaultIcons: Record<string, string> = {
    default: 'ri-notification-3-line',
    success: 'ri-checkbox-circle-line',
    warning: 'ri-error-warning-line',
    danger:  'ri-close-circle-line',
  };

  get active() { return this.svc.active(); }

  get icon(): string {
    const a = this.active;
    if (!a) return '';
    return a.icon ?? this.defaultIcons[a.type ?? 'default'];
  }

  get positionClass(): string {
    const pos = this.active?.position ?? 'bottom-right';
    return `sn-container sn-container--${pos}`;
  }

  get typeClass(): string {
    return `sn-card sn-card--${this.active?.type ?? 'default'}`;
  }
}
