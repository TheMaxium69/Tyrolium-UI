import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';

/**
 * Carte d'authentification Useritium plein écran (logo, titre, sous-titre, pied).
 * Le contenu (formulaire, message…) est projeté et peut utiliser les classes de la carte :
 * .auth-form, .auth-field, .auth-pass-wrap, .auth-pass-toggle, .auth-submit, .auth-secondary,
 * .auth-error, .auth-success, .auth-text, .auth-hint, .auth-links, .auth-link, .auth-state-icon.
 * Sous-titre personnalisable via un élément [authSubtitle] ; sinon le slogan Useritium.
 */
@Component({
  selector: 'tyro-ui-auth-card',
  templateUrl: './tyro-ui-auth-card.html',
  styleUrl: './tyro-ui-auth-card.css',
  encapsulation: ViewEncapsulation.None,
})
export class TyroUiAuthCard {
  @Input() title = 'Useritium';
  @Input() logo  = 'assets/tyrolium-ui/projects/Useritium.png';
  /** Pied de carte ; par défaut le slogan Useritium (FR/EN). */
  @Input() footer?:   string;
  @Input() footerEn?: string;

  readonly lang = inject(TyroUiLangService).lang;
}
