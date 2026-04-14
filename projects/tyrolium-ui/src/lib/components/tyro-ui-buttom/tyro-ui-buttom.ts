import { Component, Input } from '@angular/core';
import { TyroUiGloss } from '../../directive/tyro-ui-gloss';
import { TyroUiGlossBorder } from '../../directive/tyro-ui-gloss-border';

@Component({
  selector: 'tyro-ui-buttom',
  imports: [TyroUiGloss, TyroUiGlossBorder],
  templateUrl: './tyro-ui-buttom.html',
  styleUrl: './tyro-ui-buttom.css',
})
export class TyroUiButtom {
  @Input() name: string = 'Name Buttom';
  @Input() type: string = 'none'; /* primary / secondary */
}
