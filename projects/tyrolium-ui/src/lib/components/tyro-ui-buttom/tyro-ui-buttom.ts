import { Component, Input } from '@angular/core';

@Component({
  selector: 'tyro-ui-buttom',
  imports: [],
  templateUrl: './tyro-ui-buttom.html',
  styleUrl: './tyro-ui-buttom.css',
})
export class TyroUIButtom {
  @Input() name: string = 'Name Buttom';
  @Input() type: string = 'primary';
}
