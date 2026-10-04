import { Component, computed, inject, signal } from '@angular/core';
import {
  TyroUiUserChip, ITyroUiUserChipBadge, ITyroUiUserChipLine, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-user-chip-page',
  imports: [TyroUiUserChip, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './user-chip-page.html',
})
export class UserChipPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Démo : détail chargé à l'ouverture (simule un appel API) ─── */
  readonly loading = signal(false);
  readonly loaded  = signal(false);

  readonly staticBadges = computed<ITyroUiUserChipBadge[]>(() => [
    { label: this.lang() === 'en' ? 'Internal' : 'Interne', variant: 'accent',  icon: 'ri-shield-user-line' },
    { label: this.lang() === 'en' ? 'Active' : 'Actif',     variant: 'success', icon: 'ri-checkbox-circle-line' },
  ]);

  readonly bannedBadges = computed<ITyroUiUserChipBadge[]>(() => [
    { label: 'Public', icon: 'ri-user-line' },
    { label: this.lang() === 'en' ? 'Banned' : 'Banni', variant: 'danger', icon: 'ri-forbid-line' },
  ]);

  readonly guestLines: ITyroUiUserChipLine[] = [{ text: 'contact@dupont.fr', icon: 'ri-mail-line' }];
  readonly guestBadges = computed<ITyroUiUserChipBadge[]>(() => [
    { label: this.lang() === 'en' ? 'No account' : 'Sans compte', icon: 'ri-user-unfollow-line' },
  ]);

  readonly asyncBadges = computed<ITyroUiUserChipBadge[]>(() => this.loaded() ? this.staticBadges() : []);

  onOpened() {
    if (this.loaded()) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.loaded.set(true);
    }, 900);
  }

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '160px' },
    { key: 'type',        label: 'Type',                             width: '220px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[name]', type: 'string', default: "''",
      description: 'Nom affiché (ex. displayName, sinon pseudo) - sert aussi à générer l\'avatar sans [src]',
      descriptionEn: 'Displayed name (e.g. displayName, otherwise username) - also used to generate the avatar without [src]' },
    { prop: '[username]', type: 'string', default: '-',
      description: 'Pseudo, affiché en <code>@pseudo</code> dans la bulle', descriptionEn: 'Username, shown as <code>@username</code> in the bubble' },
    { prop: '[src]', type: 'string (URL)', default: '-',
      description: 'Photo de profil (voir <code>tyro-ui-avatar</code>)', descriptionEn: 'Profile picture (see <code>tyro-ui-avatar</code>)' },
    { prop: '[size]', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'sm'",
      description: 'Taille de l\'avatar de la pilule', descriptionEn: 'Size of the pill avatar' },
    { prop: '[clickable]', type: 'boolean', default: 'true',
      description: '<code>false</code> : simple affichage, sans bulle', descriptionEn: '<code>false</code>: display only, no bubble' },
    { prop: '[badges]', type: 'ITyroUiUserChipBadge[]', default: '[]',
      description: 'Étiquettes de la bulle : <code>{ label, variant?, icon? }</code> (variantes de <code>tyro-ui-chip</code>)',
      descriptionEn: 'Bubble tags: <code>{ label, variant?, icon? }</code> (<code>tyro-ui-chip</code> variants)' },
    { prop: '[lines]', type: 'ITyroUiUserChipLine[]', default: '[]',
      description: 'Lignes d\'information de la bulle : <code>{ text, icon? }</code> (ex. un email)',
      descriptionEn: 'Bubble info lines: <code>{ text, icon? }</code> (e.g. an e-mail)' },
    { prop: '[detailLoading]', type: 'boolean', default: 'false',
      description: 'Squelette à la place des lignes et étiquettes pendant un chargement',
      descriptionEn: 'Skeleton instead of lines and tags while loading' },
    { prop: '[detailError]', type: 'string | null', default: 'null',
      description: 'Message affiché si le détail n\'a pas pu être chargé', descriptionEn: 'Message shown when the details could not be loaded' },
    { prop: '[bubbleLabel]', type: 'string', default: "'Détail'",
      description: 'Titre de la bulle (FR/EN automatique par défaut)', descriptionEn: 'Bubble title (automatic FR/EN by default)' },
  ];

  readonly outputsData: PropRow[] = [
    { prop: '(opened)', type: 'void', default: '-',
      description: 'Bulle ouverte - le bon moment pour charger le détail (API)', descriptionEn: 'Bubble opened - the right time to load the details (API)' },
    { prop: '(closed)', type: 'void', default: '-',
      description: 'Bulle fermée (clic extérieur, Échap ou défilement)', descriptionEn: 'Bubble closed (outside click, Escape or scroll)' },
  ];

  readonly usageCode =
`<tyro-ui-user-chip
  [name]="user.displayName || user.username"
  [username]="user.username"
  [src]="user.pp"
  [badges]="badges()"
  [detailLoading]="loading()"
  (opened)="loadUserCard(user.id)">
</tyro-ui-user-chip>`;
}
