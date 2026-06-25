import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TyroUiGloss } from '../../../directive/tyro-ui-gloss';
import { TyroUiGlossBorder } from '../../../directive/tyro-ui-gloss-border';

export type TyroUiButtonVariant = 'classic' | 'lite' | 'gradient' | 'ghost';
export type TyroUiButtonSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'tyro-ui-button',
  imports: [TyroUiGloss, TyroUiGlossBorder],
  templateUrl: './tyro-ui-button.html',
  styleUrl: './tyro-ui-button.css',
})
export class TyroUiButton {
  @Input() variant:   TyroUiButtonVariant = 'classic';
  @Input() size:      TyroUiButtonSize    = 'md';
  @Input() icon?:     string;
  @Input() iconRight?: string;
  @Input() disabled  = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  get btnClass(): string {
    return `tb-btn tb-btn--${this.variant} tb-btn--${this.size}`;
  }

  get glossColor(): string {
    switch (this.variant) {
      case 'classic':  return 'rgba(255, 255, 255, 0.20)';
      case 'lite':     return 'rgba(255, 255, 255, 0.30)';
      case 'gradient': return 'rgba(255, 255, 255, 0.22)';
      case 'ghost':    return 'rgba(5, 51, 200, 0.09)';
    }
  }

  /* Border glow uniquement pour lite, transparent sur les autres */
  get glossBorderColor(): string {
    return this.variant === 'lite' ? 'rgba(255, 255, 255, 0.75)' : 'transparent';
  }
}
