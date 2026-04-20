import {Component, Input} from '@angular/core';

@Component({
  selector: 'tyro-ui-footer',
  imports: [],
  templateUrl: './tyro-ui-footer.html',
  styleUrl: './tyro-ui-footer.css',
})
export class TyroUiFooter {
  @Input() project: string = ''; /* tyrolium / solidserv / gamenium / ... */
  @Input() logo: string = '';
}
