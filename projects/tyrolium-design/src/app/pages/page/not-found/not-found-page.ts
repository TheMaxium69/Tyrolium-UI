import { Component } from '@angular/core';
import { TyroUiNotFound } from 'tyrolium-ui';

@Component({
  selector: 'app-not-found-page',
  imports: [TyroUiNotFound],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {
  readonly inlineDesc = `{ path: '**', component: TyroUiNotFound }`;
  readonly routeCode =
`import { TyroUiNotFound } from 'tyrolium-ui';

export const routes: Routes = [
  // ...vos routes
  { path: '**', component: TyroUiNotFound },
];`;
}
