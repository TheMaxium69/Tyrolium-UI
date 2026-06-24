import { Component, Input } from '@angular/core';

@Component({
  selector: 'tyro-ui-page-header',
  templateUrl: './tyro-ui-page-header.html',
  styleUrl: './tyro-ui-page-header.css',
})
export class TyroUiPageHeader {
  @Input() label?: string;
  @Input() title  = '';
}
