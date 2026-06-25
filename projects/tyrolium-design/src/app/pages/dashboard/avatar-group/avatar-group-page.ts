import { Component, inject } from '@angular/core';
import {
  TyroUiAvatarGroup, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn, TyroUiBentoCard,
  ITyroUiAvatarItem,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-avatar-group-page',
  imports: [TyroUiAvatarGroup, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './avatar-group-page.html',
})
export class AvatarGroupPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly team: ITyroUiAvatarItem[] = [
    { name: 'Alice Martin' },
    { name: 'Bob Dupont' },
    { name: 'Charlie Lee' },
    { name: 'Diana Prince' },
    { name: 'Ethan Hunt' },
    { name: 'Flora Duval' },
  ];

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '150px' },
    { key: 'type',        label: 'Type',                             width: '220px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '90px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    { prop: '[avatars]', type: 'ITyroUiAvatarItem[]', default: '[]',
      description: 'Liste des avatars { src?, name? }', descriptionEn: 'Avatar list { src?, name? }' },
    { prop: '[max]',     type: 'number', default: '4',
      description: 'Nb max d\'avatars affichés avant +N', descriptionEn: 'Max shown before +N overflow' },
    { prop: '[size]',    type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'",
      description: 'Taille de chaque avatar', descriptionEn: 'Size of each avatar' },
  ];
}
