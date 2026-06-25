import { Injectable, signal } from '@angular/core';
import { ITyroUiSnackbarConfig } from '../../../interface/ityro-ui-snackbar-config';

export interface ITyroUiSnackbarState extends ITyroUiSnackbarConfig {
  id: number; /* change de valeur pour re-déclencher l'animation Angular */
}

@Injectable({ providedIn: 'root' })
export class TyroUiSnackbarService {
  private readonly _active = signal<ITyroUiSnackbarState | null>(null);
  readonly active = this._active.asReadonly();

  private _timer?: ReturnType<typeof setTimeout>;
  private _idCounter = 0;

  show(config: ITyroUiSnackbarConfig): void {
    clearTimeout(this._timer);
    this._active.set({ ...config, id: ++this._idCounter });

    const duration = config.duration ?? 4000;
    if (duration > 0) {
      this._timer = setTimeout(() => this.dismiss(), duration);
    }
  }

  dismiss(): void {
    clearTimeout(this._timer);
    this._active.set(null);
  }
}
