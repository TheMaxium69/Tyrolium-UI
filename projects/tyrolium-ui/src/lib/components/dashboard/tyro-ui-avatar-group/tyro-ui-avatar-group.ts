import { Component, Input } from '@angular/core';
import { TyroUiAvatar, TyroUiAvatarSize } from '../tyro-ui-avatar/tyro-ui-avatar';
import { ITyroUiAvatarItem } from '../../../interface/ityro-ui-avatar-item';

@Component({
  selector: 'tyro-ui-avatar-group',
  imports: [TyroUiAvatar],
  templateUrl: './tyro-ui-avatar-group.html',
  styleUrl: './tyro-ui-avatar-group.css',
})
export class TyroUiAvatarGroup {
  @Input() avatars: ITyroUiAvatarItem[] = [];
  @Input() max     = 4;
  @Input() size:   TyroUiAvatarSize = 'md';

  get visible(): ITyroUiAvatarItem[] {
    return this.avatars.slice(0, this.max);
  }

  get overflow(): number {
    return Math.max(0, this.avatars.length - this.max);
  }
}
