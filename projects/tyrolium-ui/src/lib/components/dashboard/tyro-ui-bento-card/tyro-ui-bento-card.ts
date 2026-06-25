import { Component, Input } from '@angular/core';

@Component({
  selector: 'tyro-ui-bento-card',
  templateUrl: './tyro-ui-bento-card.html',
  styleUrl: './tyro-ui-bento-card.css',
})
export class TyroUiBentoCard {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() title?: string;
  @Input() label?: string;
  @Input() icon?: string;
  @Input() iconImg?: string;
  @Input() gradient = false;
  @Input() hoverable = false;
}
