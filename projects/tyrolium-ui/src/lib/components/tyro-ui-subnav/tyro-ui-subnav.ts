import { Component, Input } from '@angular/core';
import { ITyroUiNavbarPages } from 'tyrolium-ui';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'tyro-ui-subnav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tyro-ui-subnav.html',
  styleUrl: './tyro-ui-subnav.css',
})
export class TyroUiSubnav {
  @Input() pages: ITyroUiNavbarPages[] = [];
  @Input() isFixed: boolean = false;
}
