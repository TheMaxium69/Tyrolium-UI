import { Component } from '@angular/core';
import { TyroUiForbidden } from 'tyrolium-ui';

@Component({
  selector: 'app-forbidden-page',
  imports: [TyroUiForbidden],
  templateUrl: './forbidden-page.html',
})
export class ForbiddenPage {
  readonly guardCode =
`import { TyroUiForbidden } from 'tyrolium-ui';

// Route protégée
{ path: 'admin', component: AdminPage, canActivate: [authGuard] },

// Route 403 dédiée
{ path: 'forbidden', component: TyroUiForbidden },`;
}
