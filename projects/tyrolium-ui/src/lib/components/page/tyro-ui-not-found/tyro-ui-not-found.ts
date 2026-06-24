import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';

@Component({
  selector: 'tyro-ui-not-found',
  imports: [RouterLink],
  templateUrl: './tyro-ui-not-found.html',
  styleUrl: './tyro-ui-not-found.css',
})
export class TyroUiNotFound {
  @Input() homeLink: string = '/';
  @Input() homeLabel: string = "Retour à l'accueil";
  @Input() homeLabelEn: string = 'Back to home';

  readonly lang = inject(TyroUiLangService).lang;

  goBack() {
    window.history.back();
  }
}
