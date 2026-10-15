import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';
import { TyroUiAuthCard } from '../tyro-ui-auth-card/tyro-ui-auth-card';

export interface ITyroUiLoginCredentials {
  identifier: string;
  password:   string;
}

/**
 * Page de connexion Useritium plein écran (même design que le formulaire OAuth d'ApiUseritium).
 * Purement présentationnelle : le site gère l'appel API via (submitted), et renvoie loading/error.
 */
@Component({
  selector: 'tyro-ui-login',
  imports: [FormsModule, RouterLink, TyroUiAuthCard],
  templateUrl: './tyro-ui-login.html',
  styleUrl: './tyro-ui-login.css',
})
export class TyroUiLogin implements AfterViewInit {
  /** Nom de l'application qui demande la connexion (ex : "Tyrolium Hub"). */
  @Input() appName = '';
  @Input() title   = 'Useritium';
  @Input() logo    = 'assets/tyrolium-ui/projects/Useritium.png';
  @Input() loading = false;
  @Input() error: string | null = null;
  /** Message d'information (ex. « Mot de passe modifié, reconnectez-vous »), affiché en vert. */
  @Input() notice: string | null = null;
  /** Focus auto sur l'identifiant ; à désactiver si le composant n'est pas en haut de page. */
  @Input() autofocus = true;
  /** Pied de carte ; par défaut le slogan Useritium (FR/EN). */
  @Input() footer?:   string;
  @Input() footerEn?: string;
  /** Liens optionnels sous le bouton (routes du site) ; masqués si absents. */
  @Input() forgotLink?:   string;
  @Input() registerLink?: string;

  @Output() submitted = new EventEmitter<ITyroUiLoginCredentials>();

  readonly lang = inject(TyroUiLangService).lang;

  @ViewChild('identifierInput') identifierInput?: ElementRef<HTMLInputElement>;

  identifier = '';
  password   = '';
  showPass   = false;

  // L'attribut HTML autofocus ne s'applique qu'au chargement initial du document,
  // pas à un composant inséré plus tard par Angular.
  ngAfterViewInit() {
    if (this.autofocus) this.identifierInput?.nativeElement.focus({ preventScroll: true });
  }

  submit(e: Event) {
    e.preventDefault();
    if (this.loading || !this.identifier.trim() || !this.password) return;
    this.submitted.emit({ identifier: this.identifier.trim(), password: this.password });
    this.password = '';
    this.showPass = false;
  }
}
