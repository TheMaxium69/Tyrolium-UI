import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TyroUiAuthService } from '../../services/tyro-ui-auth.service';
import { TyroUiLangService } from '../../services/tyro-ui-lang.service';

@Component({
  selector: 'tyro-ui-auth-modal',
  imports: [FormsModule],
  templateUrl: './tyro-ui-auth-modal.html',
  styleUrl: './tyro-ui-auth-modal.css',
})
export class TyroUiAuthModal {
  readonly auth = inject(TyroUiAuthService);
  readonly lang = inject(TyroUiLangService).lang;

  login    = '';
  password = '';
  showPass = false;

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('auth-overlay')) {
      this.auth.closeModal();
    }
  }

  async submit(e: Event) {
    e.preventDefault();
    await this.auth.login(this.login, this.password);
    this.login    = '';
    this.password = '';
    this.showPass = false;
  }
}
