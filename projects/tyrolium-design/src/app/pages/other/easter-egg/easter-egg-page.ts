import { Component, inject } from '@angular/core';
import { TyroUiEasterEgg, TyroUiAuthService } from 'tyrolium-ui';

@Component({
  selector: 'app-easter-egg-page',
  imports: [TyroUiEasterEgg],
  templateUrl: './easter-egg-page.html',
})
export class EasterEggPage {}
