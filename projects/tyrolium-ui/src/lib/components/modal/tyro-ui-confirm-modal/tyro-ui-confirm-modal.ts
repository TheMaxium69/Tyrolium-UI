import { Component, inject } from '@angular/core';
import { TyroUiConfirmService } from './tyro-ui-confirm.service';

@Component({
  selector: 'tyro-ui-confirm-modal',
  templateUrl: './tyro-ui-confirm-modal.html',
  styleUrl: './tyro-ui-confirm-modal.css',
})
export class TyroUiConfirmModal {
  readonly svc = inject(TyroUiConfirmService);

  get state() { return this.svc.state(); }

  get icon(): string {
    return this.state?.icon ?? (this.state?.type === 'danger' ? 'ri-error-warning-line' : 'ri-question-line');
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('cm-overlay')) {
      this.svc.answer(false);
    }
  }
}
