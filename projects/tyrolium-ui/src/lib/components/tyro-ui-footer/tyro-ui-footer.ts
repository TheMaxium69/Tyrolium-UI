import {Component, Input, inject} from '@angular/core';
import {FooterOtherLink, FooterProjectPage} from "../../configs/menu-footer";
import {ITyroUiFooterPage} from "../../interface/ityro-ui-footer-page";
import {TyroUiGloss} from "../../directive/tyro-ui-gloss";
import {ITyroUiNavbarPages} from "../../interface/ityro-ui-navbar-pages";
import {RouterLink} from "@angular/router";
import {TyroUiLangService} from "../../services/tyro-ui-lang.service";

@Component({
  selector: 'tyro-ui-footer',
  imports: [
    TyroUiGloss,
    RouterLink
  ],
  templateUrl: './tyro-ui-footer.html',
  styleUrl: './tyro-ui-footer.css',
})
export class TyroUiFooter {
  @Input() project: string = ''; /* tyrolium / solidserv / gamenium / ... */
  @Input() logo: string = '';
  @Input() content: string = '';
  @Input() pages: ITyroUiNavbarPages[] = [];
  @Input() socials: ITyroUiNavbarPages[] = [];

  currentYear: number = new Date().getFullYear();

  public footerProjectPage: ITyroUiFooterPage[] = FooterProjectPage;
  public footerOtherLink: ITyroUiFooterPage[] = FooterOtherLink;

  readonly lang = inject(TyroUiLangService).lang;
}
