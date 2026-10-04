import { Component, inject, signal } from '@angular/core';
import {
  TyroUiLogin,
  ITyroUiLoginCredentials,
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
  selector: 'app-login-page',
  imports: [TyroUiLogin, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Démo : simule un appel API qui échoue ─── */
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);

  onSubmit(_credentials: ITyroUiLoginCredentials) {
    this.error.set(null);
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.error.set(this.lang() === 'en' ? 'Invalid credentials.' : 'Identifiants invalides.');
    }, 1200);
  }

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '200px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    {
      prop: '[appName]', type: 'string', default: "''",
      description:   'Application qui demande la connexion, affichée dans « Connexion requise par <b>…</b> ». Vide → slogan Useritium.',
      descriptionEn: 'App requesting the sign-in, shown in “Sign-in required by <b>…</b>”. Empty → Useritium tagline.',
    },
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
      prop: '[loading]', type: 'boolean', default: 'false',
      description:   'Désactive le formulaire et affiche le spinner sur le bouton',
      descriptionEn: 'Disables the form and shows a spinner on the button',
    },
    {
      prop: '[error]', type: 'string | null', default: 'null',
      description:   'Message d\'erreur affiché au-dessus des champs',
      descriptionEn: 'Error message shown above the fields',
    },
    {
      prop: '[autofocus]', type: 'boolean', default: 'true',
      description:   'Focus automatique sur le champ identifiant (à désactiver si le composant n\'est pas en haut de page)',
      descriptionEn: 'Auto-focus the identifier field (disable it when the component is not at the top of the page)',
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

  readonly outputsData: PropRow[] = [
    {
      prop: '(submitted)', type: 'ITyroUiLoginCredentials', default: '-',
      description:   'Émis à la validation avec <code>{ identifier, password }</code>. Le champ mot de passe est vidé ensuite.',
      descriptionEn: 'Emitted on submit with <code>{ identifier, password }</code>. The password field is cleared afterwards.',
    },
  ];

  readonly usageCode =
`import { TyroUiLogin, ITyroUiLoginCredentials } from 'tyrolium-ui';

// Template
<tyro-ui-login
  appName="Tyrolium Hub"
  [loading]="auth.loading()"
  [error]="auth.error()"
  (submitted)="onSubmit($event)">
</tyro-ui-login>

// Composant / Component
onSubmit({ identifier, password }: ITyroUiLoginCredentials) {
  this.auth.login(identifier, password);
}`;
}
