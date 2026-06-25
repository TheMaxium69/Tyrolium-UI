import { Component, inject } from '@angular/core';
import {
  TyroUiAvatar, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-avatar-page',
  imports: [TyroUiAvatar, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './avatar-page.html',
})
export class AvatarPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '150px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '90px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[src]',  type: 'string (URL)', default: '—',
      description: 'URL de la photo de profil', descriptionEn: 'Profile picture URL' },
    { prop: '[name]', type: 'string',       default: '—',
      description: 'Nom complet — initiales calculées si pas de src', descriptionEn: 'Full name — initials computed when no src' },
    { prop: '[size]', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'",
      description: 'Taille : xs=24px, sm=32px, md=40px, lg=56px', descriptionEn: 'Size: xs=24px, sm=32px, md=40px, lg=56px' },
  ];
}
