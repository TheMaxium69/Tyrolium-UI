import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITyroUiButtonGroupItem } from '../../../interface/ityro-ui-button-group-item';

export type TyroUiButtonGroupVariant = 'lite' | 'classic' | 'gradient';
export type TyroUiButtonGroupSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'tyro-ui-button-group',
  templateUrl: './tyro-ui-button-group.html',
  styleUrl: './tyro-ui-button-group.css',
})
export class TyroUiButtonGroup {
  @Input() items:   ITyroUiButtonGroupItem[] = [];
  @Input() value?:  string;
  @Input() variant: TyroUiButtonGroupVariant = 'lite';
  @Input() size:    TyroUiButtonGroupSize    = 'md';

  @Output() valueChange = new EventEmitter<string>();

  get groupClass(): string {
    return `btg-group btg-group--${this.variant} btg-group--${this.size}`;
  }

  isActive(val: string): boolean {
    return this.value === val;
  }

  select(item: ITyroUiButtonGroupItem): void {
    if (item.disabled) return;
    this.value = item.value;
    this.valueChange.emit(item.value);
  }
}
