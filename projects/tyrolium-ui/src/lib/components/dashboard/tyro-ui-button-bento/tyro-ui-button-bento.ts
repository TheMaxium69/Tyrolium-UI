import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tyro-ui-button-bento',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './tyro-ui-button-bento.html',
  styleUrl: './tyro-ui-button-bento.css',
})
export class TyroUiButtonBento {
  @Input() short    = false;
  @Input() gradient = false;
  @Input() icon     = '';
  @Input() iconImg?: string;
  @Input() tag?:    string;
  @Input() label    = '';
  @Input() sublabel?: string;
  @Input() link?:   string;
  @Input() href?:   string;
}
