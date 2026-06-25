import { Component, Input } from '@angular/core';

export type TyroUiProgressBarVariant = 'simple' | 'lite' | 'gradient';

@Component({
  selector: 'tyro-ui-progress-bar',
  templateUrl: './tyro-ui-progress-bar.html',
  styleUrl: './tyro-ui-progress-bar.css',
})
export class TyroUiProgressBar {
  @Input() variant:    TyroUiProgressBarVariant = 'simple';
  @Input() value       = 0;
  @Input() color       = '#0533c8';
  @Input() label?:     string;
  @Input() showLabel   = false;
  @Input() height      = '8px';

  get clampedValue(): number {
    return Math.min(100, Math.max(0, this.value));
  }

  get fillBackground(): string | null {
    return this.variant !== 'gradient' ? this.color : null;
  }

  get fillGlow(): string | null {
    return this.variant === 'lite' ? `0 0 10px 2px ${this.color}` : null;
  }

  get trackStyle(): Record<string, string> {
    return { height: this.height };
  }
}
