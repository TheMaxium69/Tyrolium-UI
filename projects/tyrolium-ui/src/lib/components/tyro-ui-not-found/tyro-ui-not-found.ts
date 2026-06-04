import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tyro-ui-not-found',
  imports: [RouterLink],
  templateUrl: './tyro-ui-not-found.html',
  styleUrl: './tyro-ui-not-found.css',
})
export class TyroUiNotFound {
  @Input() homeLink: string = '/';
  @Input() homeLabel: string = "Retour à l'accueil";

  goBack() {
    window.history.back();
  }
}
