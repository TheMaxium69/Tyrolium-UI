import { Component, inject } from '@angular/core';
import {
  TyroUiNotFound,
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
  selector: 'app-not-found-page',
  imports: [TyroUiNotFound, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '180px' },
    { key: 'type',        label: 'Type',                             width: '100px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '180px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    {
      prop: '[homeLink]', type: 'string', default: "'/'",
      description:   'Route du bouton de retour à l\'accueil',
      descriptionEn: 'Route for the back-to-home button',
    },
    {
      prop: '[homeLabel]', type: 'string', default: "\"Retour à l'accueil\"",
      description:   'Texte du bouton (fr)',
      descriptionEn: 'Button text (fr)',
    },
    {
      prop: '[homeLabelEn]', type: 'string', default: "'Back to home'",
      description:   'Texte du bouton (en)',
      descriptionEn: 'Button text (en)',
    },
  ];

  readonly routeCode =
`import { TyroUiNotFound } from 'tyrolium-ui';

export const routes: Routes = [
  // ...vos routes / your routes
  { path: '**', component: TyroUiNotFound },
];`;
}
