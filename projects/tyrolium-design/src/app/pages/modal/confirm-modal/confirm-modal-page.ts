import { Component, inject } from '@angular/core';
import {
  TyroUiConfirmModal, TyroUiConfirmService,
  TyroUiButton, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn,
  TyroUiBentoCard, TyroUiAlert,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface ApiRow { prop: string; type: string; default: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-confirm-modal-page',
  imports: [TyroUiButton, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard, TyroUiAlert],
  templateUrl: './confirm-modal-page.html',
})
export class ConfirmModalPage {
  readonly lang    = inject(TyroUiLangService).lang;
  private readonly confirm = inject(TyroUiConfirmService);

  lastResult: boolean | null = null;

  async ask(type: 'default' | 'danger' = 'default'): Promise<void> {
    const fr = this.lang() === 'fr';
    this.lastResult = await this.confirm.confirm({
      type,
      icon:  type === 'danger' ? 'ri-delete-bin-line' : 'ri-question-line',
      title: fr ? (type === 'danger' ? 'Supprimer cet élément ?' : 'Confirmer l\'action ?')
                : (type === 'danger' ? 'Delete this item?' : 'Confirm action?'),
      message: fr
        ? (type === 'danger' ? 'Cette action est irréversible. L\'élément sera définitivement supprimé.'
                             : 'Êtes-vous sûr de vouloir continuer ?')
        : (type === 'danger' ? 'This action cannot be undone. The item will be permanently removed.'
                             : 'Are you sure you want to proceed?'),
      confirmLabel: fr ? (type === 'danger' ? 'Supprimer' : 'Confirmer') : (type === 'danger' ? 'Delete' : 'Confirm'),
      cancelLabel:  fr ? 'Annuler' : 'Cancel',
    });
  }

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '200px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '110px' },
    { key: 'description', label: 'Description' },
  ];

  readonly configData: ApiRow[] = [
    { prop: 'title',         type: 'string',   default: '—',
      description: 'Titre de la modale', descriptionEn: 'Modal title' },
    { prop: 'message',       type: 'string',   default: '—',
      description: 'Corps du message', descriptionEn: 'Message body' },
    { prop: 'icon',          type: 'string (Remix Icon)', default: '—',
      description: 'Icône — défaut selon type', descriptionEn: 'Icon — defaults by type' },
    { prop: 'type',          type: "'default' | 'danger'", default: "'default'",
      description: 'Couleur du bouton confirmer et de l\'icône', descriptionEn: 'Color of confirm button and icon' },
    { prop: 'confirmLabel',  type: 'string',   default: "'Confirmer'",
      description: 'Texte du bouton de confirmation', descriptionEn: 'Confirm button text' },
    { prop: 'cancelLabel',   type: 'string',   default: "'Annuler'",
      description: 'Texte du bouton annuler', descriptionEn: 'Cancel button text' },
  ];
}
