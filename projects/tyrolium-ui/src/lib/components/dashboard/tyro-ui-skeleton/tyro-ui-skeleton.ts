import { Component, Input } from '@angular/core';

export type TyroUiSkeletonVariant = 'rect' | 'text' | 'circle';

@Component({
  selector: 'tyro-ui-skeleton',
  templateUrl: './tyro-ui-skeleton.html',
  styleUrl: './tyro-ui-skeleton.css',
})
export class TyroUiSkeleton {
  @Input() variant: TyroUiSkeletonVariant = 'rect';
  @Input() width    = '100%';
  @Input() height   = '16px';
  @Input() borderRadius?: string;
  @Input() count    = 1;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }

  get boneStyle(): Record<string, string> {
    const styles: Record<string, string> = {};

    if (this.variant === 'circle') {
      const size = this.width !== '100%' ? this.width : this.height;
      styles['width']  = size;
      styles['height'] = size;
      styles['border-radius'] = '50%';
    } else if (this.variant === 'text') {
      styles['width']  = this.width;
      styles['height'] = this.height;
      styles['border-radius'] = this.borderRadius ?? '4px';
    } else {
      styles['width']  = this.width;
      styles['height'] = this.height;
      styles['border-radius'] = this.borderRadius ?? '8px';
    }

    return styles;
  }
}
