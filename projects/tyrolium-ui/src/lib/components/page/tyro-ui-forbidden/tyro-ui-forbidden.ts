import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';

@Component({
  selector: 'tyro-ui-forbidden',
  imports: [RouterLink],
  templateUrl: './tyro-ui-forbidden.html',
  styleUrl: './tyro-ui-forbidden.css',
})
export class TyroUiForbidden {
  @Input() homeLink: string = '/';
  @Input() homeLabel: string = "Retour à l'accueil";
  @Input() homeLabelEn: string = 'Back to home';

  readonly lang = inject(TyroUiLangService).lang;

  goBack() {
    window.history.back();
  }
}
