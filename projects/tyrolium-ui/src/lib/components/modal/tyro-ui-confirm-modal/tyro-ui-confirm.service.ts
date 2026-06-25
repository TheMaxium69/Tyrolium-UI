import { Injectable, signal } from '@angular/core';
import { ITyroUiConfirmConfig } from '../../../interface/ityro-ui-confirm-config';

export interface ITyroUiConfirmState extends ITyroUiConfirmConfig {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class TyroUiConfirmService {
  private readonly _state = signal<ITyroUiConfirmState | null>(null);
  readonly state = this._state.asReadonly();

  private _resolve?: (value: boolean) => void;
  private _idCounter = 0;

  confirm(config: ITyroUiConfirmConfig): Promise<boolean> {
    this._state.set({ ...config, id: ++this._idCounter });
    return new Promise(resolve => { this._resolve = resolve; });
  }

  answer(value: boolean): void {
    this._resolve?.(value);
    this._resolve = undefined;
    this._state.set(null);
  }
}
