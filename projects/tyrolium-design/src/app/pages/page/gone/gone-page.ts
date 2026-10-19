import { Component, inject } from '@angular/core';
import {
  TyroUiGone,
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
  selector: 'app-gone-page',
  imports: [TyroUiGone, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './gone-page.html',
})
export class GonePage {
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
`import { tyroUiErrorRoutes } from 'tyrolium-ui';

export const routes: Routes = [
  // ...vos routes / your routes
  ...tyroUiErrorRoutes(), // 403, 404, 410 + wildcard
];`;

  readonly serverCode =
`// scripts/tyrobuild.mjs - liste des sites / site list
{ key: 'tyrolium', …, gone: ['ServerMC', 'Panel'] },

// → .htaccess (Apache)
RewriteRule ^(ServerMC|Panel)(/.*)?$ - [R=410,L]
ErrorDocument 410 /410/index.html

// → .tyro-nginx.conf (Nginx)
location ~ ^/(ServerMC|Panel)(/|$) { return 410; }
error_page 410 /410/index.html;`;
}
