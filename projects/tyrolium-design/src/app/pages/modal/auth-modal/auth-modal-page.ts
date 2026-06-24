import { Component, inject } from '@angular/core';
import { TyroUiAuthModal, TyroUiAuthService } from 'tyrolium-ui';

@Component({
  selector: 'app-auth-modal-page',
  imports: [TyroUiAuthModal],
  styleUrl: './auth-modal-page.css',
  templateUrl: './auth-modal-page.html',
})
export class AuthModalPage {
  readonly auth = inject(TyroUiAuthService);
}
