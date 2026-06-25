import { Component, inject } from '@angular/core';
import {
  TyroUiAuthModal, TyroUiAuthService,
  TyroUiButton, TyroUiPageHeader, TyroUiLangService,
  TyroUiDataTable, TyroUiDataTableColDef, ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface ApiRow { member: string; type: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-auth-modal-page',
  imports: [
    TyroUiAuthModal, TyroUiButton,
    TyroUiPageHeader, DsPreview,
    TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard,
  ],
  templateUrl: './auth-modal-page.html',
  styleUrl: './auth-modal-page.css',
})
export class AuthModalPage {
  readonly lang = inject(TyroUiLangService).lang;
  readonly auth = inject(TyroUiAuthService);

  readonly apiCols: ITyroUiDataTableColumn[] = [
    { key: 'member',      label: 'Membre',      labelEn: 'Member',      width: '220px' },
    { key: 'type',        label: 'Type',                                 width: '200px' },
    { key: 'description', label: 'Description' },
  ];

  readonly signalsData: ApiRow[] = [
    { member: 'user()',      type: 'Signal<ITyroUiUser | null>',
      description: 'Utilisateur connecté - null si déconnecté', descriptionEn: 'Logged-in user - null if disconnected' },
    { member: 'modalOpen()', type: 'Signal<boolean>',
      description: 'Vrai si la modale est ouverte', descriptionEn: 'True while the modal is open' },
    { member: 'modalTab()',  type: "Signal<'login' | 'register'>",
      description: 'Onglet actif dans la modale', descriptionEn: 'Active tab inside the modal' },
    { member: 'loading()',   type: 'Signal<boolean>',
      description: "Vrai pendant l'appel API de connexion", descriptionEn: 'True during the login API call' },
    { member: 'error()',     type: 'Signal<string | null>',
      description: "Message d'erreur de la dernière tentative", descriptionEn: 'Error message from the last attempt' },
  ];

  readonly methodsData: ApiRow[] = [
    { member: 'openModal()',             type: 'void',
      description: 'Ouvre la modale de connexion', descriptionEn: 'Opens the login modal' },
    { member: 'closeModal()',           type: 'void',
      description: 'Ferme la modale', descriptionEn: 'Closes the modal' },
    { member: 'login(login, password)', type: 'Promise<void>',
      description: "Soumet la connexion à l'API Useritium", descriptionEn: 'Submits login to the Useritium API' },
    { member: 'logout()',               type: 'void',
      description: 'Déconnecte et efface la session', descriptionEn: 'Logs out and clears the session' },
  ];
}
