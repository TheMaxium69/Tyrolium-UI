import {Component, Input} from "@angular/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: "tyro-ui-cta",
  imports: [
    RouterLink
  ],
  templateUrl: "./tyro-ui-cta.html",
  styleUrl: "./tyro-ui-cta.css",
})
export class TyroUiCTA {
  @Input() title: string = "";
  @Input() label: string = "";
  @Input() content: string = "";
  @Input() btn: string = "";
  @Input() btnIcon: string = "";
  @Input() btnLink: string = "";
  @Input() btnRouterLink: string = "";
  @Input() subbtn: string = "";
  @Input() subLink: string = "";
  @Input() subRouterLink: string = "";
  @Input() subAncreLink: string = "";
  @Input() notBack: boolean = false;
  @Input() vturias: boolean = false;

  scrollTo(ancre:string) {
    const element = document.getElementById(ancre);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 70;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
  
  
}
