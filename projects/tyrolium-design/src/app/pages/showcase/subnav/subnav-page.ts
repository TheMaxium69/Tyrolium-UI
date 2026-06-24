import { Component } from '@angular/core';
import { TyroUiSubnav, ITyroUiNavbarPages } from 'tyrolium-ui';

@Component({
  selector: 'app-subnav-page',
  imports: [TyroUiSubnav],
  templateUrl: './subnav-page.html',
})
export class SubnavPage {
  readonly samplePages: ITyroUiNavbarPages[] = [
    { label: 'Présentation', link: '.' },
    { label: 'Fonctionnalités', href: '/showcase/subnav/#' },
    { label: 'Tarifs', href: '/showcase/subnav/#' },
    { label: 'Documentation', href: '/showcase/subnav/#' },
  ];
}
