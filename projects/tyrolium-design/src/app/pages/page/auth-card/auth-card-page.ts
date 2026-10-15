import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TyroUiAuthCard,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-auth-card-page',
  imports: [FormsModule, TyroUiAuthCard, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './auth-card-page.html',
  styleUrl: './auth-card-page.css',
})
export class AuthCardPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Démo : formulaire d'inscription avec validation locale ─── */
  username = '';
  password = '';
  showPass = false;
  readonly loading       = signal(false);
  readonly usernameError = signal<string | null>(null);
  readonly done          = signal(false);

  onSubmit(e: Event) {
    e.preventDefault();
    this.usernameError.set(null);
    if (this.username.trim().length < 3) {
      this.usernameError.set(this.lang() === 'en'
        ? 'The username must be at least 3 characters long.'
        : 'Le pseudo doit faire au moins 3 caractères.');
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.done.set(true);
    }, 1000);
  }

  reset() {
    this.username = '';
    this.password = '';
    this.done.set(false);
  }

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '140px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '200px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    {
      prop: '[title]', type: 'string', default: "'Useritium'",
      description:   'Titre sous le logo (sa 1<sup>re</sup> lettre sert de fallback si le logo ne charge pas)',
      descriptionEn: 'Title under the logo (its first letter is the fallback if the logo fails to load)',
    },
    {
      prop: '[logo]', type: 'string', default: "'assets/tyrolium-ui/projects/Useritium.png'",
      description:   'URL du logo',
      descriptionEn: 'Logo URL',
    },
    {
      prop: '[footer]', type: 'string', default: "'Gratuit · Hébergé en France · Jamais vendu'",
      description:   'Pied de carte (fr)',
      descriptionEn: 'Card footer (fr)',
    },
    {
      prop: '[footerEn]', type: 'string', default: "'Free · Hosted in France · Never sold'",
      description:   'Pied de carte (en) - retombe sur <code>footer</code> s\'il est seul défini',
      descriptionEn: 'Card footer (en) - falls back to <code>footer</code> when only that one is set',
    },
  ];

  readonly slotsData: PropRow[] = [
    {
      prop: '[authSubtitle]', type: 'ng-content', default: 'Slogan Useritium',
      description:   'Élément projeté comme sous-titre, sous le titre. Absent → « Votre identité universelle Tyrolium ».',
      descriptionEn: 'Element projected as the subtitle, under the title. Missing → “Your universal Tyrolium identity”.',
    },
    {
      prop: '(défaut)', type: 'ng-content', default: '-',
      description:   'Contenu de la carte, entre l\'en-tête et le pied : formulaire, message d\'état…',
      descriptionEn: 'Card content, between header and footer: form, state message…',
    },
  ];

  readonly classCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Classe',     labelEn: 'Class',    width: '220px' },
    { key: 'description', label: 'Description' },
  ];

  /** L'encapsulation est désactivée : ces classes stylent le contenu projeté par le site. */
  readonly classesData: PropRow[] = [
    { prop: '.auth-form',        type: '', default: '', description: 'Colonne du contenu (formulaire ou état), espacement entre blocs', descriptionEn: 'Content column (form or state), spacing between blocks' },
    { prop: '.auth-field',       type: '', default: '', description: 'Bloc <code>label</code> + <code>input</code>', descriptionEn: '<code>label</code> + <code>input</code> block' },
    { prop: '.auth-pass-wrap',   type: '', default: '', description: 'Conteneur d\'un mot de passe avec <code>.auth-pass-toggle</code> (bouton œil)', descriptionEn: 'Password wrapper with <code>.auth-pass-toggle</code> (eye button)' },
    { prop: '.auth-hint',        type: '', default: '', description: 'Aide sous un champ ; <code>.is-error</code> pour une erreur de champ', descriptionEn: 'Help under a field; <code>.is-error</code> for a field error' },
    { prop: '.auth-submit',      type: '', default: '', description: 'Bouton principal en dégradé (<code>button</code> ou <code>a</code>), <code>.auth-spinner</code> pour le chargement', descriptionEn: 'Main gradient button (<code>button</code> or <code>a</code>), <code>.auth-spinner</code> while loading' },
    { prop: '.auth-secondary',   type: '', default: '', description: 'Bouton secondaire à contour (<code>button</code> ou <code>a</code>)', descriptionEn: 'Outlined secondary button (<code>button</code> or <code>a</code>)' },
    { prop: '.auth-error',       type: '', default: '', description: 'Message d\'erreur général (rouge)', descriptionEn: 'General error message (red)' },
    { prop: '.auth-success',     type: '', default: '', description: 'Message de confirmation (vert)', descriptionEn: 'Confirmation message (green)' },
    { prop: '.auth-text',        type: '', default: '', description: 'Paragraphe centré (explication, résultat)', descriptionEn: 'Centered paragraph (explanation, result)' },
    { prop: '.auth-state-icon',  type: '', default: '', description: 'Grand pictogramme d\'état ; <code>.is-success</code> / <code>.is-error</code>', descriptionEn: 'Large state icon; <code>.is-success</code> / <code>.is-error</code>' },
    { prop: '.auth-links',       type: '', default: '', description: 'Rangée de <code>.auth-link</code> ; <code>.is-center</code> pour un seul lien', descriptionEn: 'Row of <code>.auth-link</code>; <code>.is-center</code> for a single link' },
  ];

  readonly usageCode =
`import { TyroUiAuthCard } from 'tyrolium-ui';

<tyro-ui-auth-card>
  <span authSubtitle>Créez votre compte Useritium</span>

  <form class="auth-form" (submit)="submit($event)">
    @if (error()) {
      <p class="auth-error"><i class="ri-error-warning-line"></i> {{ error() }}</p>
    }
    <div class="auth-field">
      <label for="username">Nom d'utilisateur</label>
      <input id="username" name="username" [(ngModel)]="username">
      <p class="auth-hint is-error">3 caractères minimum.</p>
    </div>
    <button type="submit" class="auth-submit">Créer mon compte</button>
    <div class="auth-links is-center">
      <a class="auth-link" routerLink="/">Déjà un compte ? Se connecter</a>
    </div>
  </form>
</tyro-ui-auth-card>`;
}
