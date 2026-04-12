import { Component, Input } from '@angular/core';
import { ITyroUiNavbarPages } from '../../interface/ityro-ui-navbar-pages';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tyro-ui-navbar',
  imports: [RouterLink],
  templateUrl: './tyro-ui-navbar.html',
  styleUrl: './tyro-ui-navbar.css',
})
export class TyroUiNavbar {
  @Input() project: string = ''; /* tyrolium / solidserv / gamenium / ... */
  @Input() pages: ITyroUiNavbarPages[] = [];
}
