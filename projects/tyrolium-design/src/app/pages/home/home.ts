import { Component, inject } from '@angular/core';
import { TyroUiButtonBento, TyroUiLangService, TyroUiPageHeader } from 'tyrolium-ui';

@Component({
  selector: 'app-home',
  imports: [TyroUiButtonBento, TyroUiPageHeader],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly lang = inject(TyroUiLangService).lang;
}
