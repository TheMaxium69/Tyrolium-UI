import { Component, inject } from '@angular/core';
import { TyroUiNavbar, TyroUiPageHeader, TyroUiLangService } from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

@Component({
  selector: 'app-navbar-page',
  imports: [TyroUiNavbar, TyroUiPageHeader, DsPreview],
  templateUrl: './navbar-page.html',
  styleUrl: './navbar-page.css',
})
export class NavbarPage {
  readonly lang = inject(TyroUiLangService).lang;
}
