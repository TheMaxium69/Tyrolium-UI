import { Component, Input } from '@angular/core';

export type TyroUiAvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const PP_COLOR = '183153';

@Component({
  selector: 'tyro-ui-avatar',
  templateUrl: './tyro-ui-avatar.html',
  styleUrl: './tyro-ui-avatar.css',
})
export class TyroUiAvatar {
  @Input() src?:  string;
  @Input() name?: string;
  @Input() size:  TyroUiAvatarSize = 'md';

  get resolvedSrc(): string | null {
    if (this.src) return this.src;
    if (this.name) return this.generatePpUrl();
    return null;
  }

  private generatePpUrl(): string {
    const letter = (this.name ?? '').trim()[0]?.toUpperCase() ?? '?';
    return `https://tyrolium.fr/generate-pp/?l=${encodeURIComponent(letter)}&c=${PP_COLOR}`;
  }
}
