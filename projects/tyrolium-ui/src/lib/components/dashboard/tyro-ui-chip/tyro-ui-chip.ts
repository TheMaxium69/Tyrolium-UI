import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

export type TyroUiChipVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';
export type TyroUiChipSize    = 'sm' | 'md';

@Component({
  selector: 'tyro-ui-chip',
  templateUrl: './tyro-ui-chip.html',
  styleUrl: './tyro-ui-chip.css',
})
export class TyroUiChip {
  @Input() icon?:    string;
  @Input() variant:  TyroUiChipVariant = 'default';
  @Input() size:     TyroUiChipSize    = 'md';
  @Input() removable = false;

  @Output() removed = new EventEmitter<void>();

  @HostBinding('class') get hostClass(): string {
    return `ch-chip ch-chip--${this.variant} ch-chip--${this.size}`;
  }
}
