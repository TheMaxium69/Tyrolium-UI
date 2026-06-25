import { Component, ElementRef, EventEmitter, HostListener, Input, Output, signal, computed } from '@angular/core';
import { ITyroUiSelectItem } from '../../../interface/ityro-ui-select-item';

export type TyroUiSelectVariant = 'normal' | 'lite';

@Component({
  selector: 'tyro-ui-select',
  templateUrl: './tyro-ui-select.html',
  styleUrl: './tyro-ui-select.css',
})
export class TyroUiSelect {
  @Input() items:       ITyroUiSelectItem[] = [];
  @Input() value?:      string;
  @Input() placeholder  = '—';
  @Input() disabled     = false;
  @Input() variant:     TyroUiSelectVariant = 'normal';

  @Output() valueChange = new EventEmitter<string>();

  readonly isOpen = signal(false);

  get selectedItem(): ITyroUiSelectItem | undefined {
    return this.items.find(i => i.value === this.value);
  }

  get triggerClass(): string {
    return `sl-trigger sl-trigger--${this.variant}${this.disabled ? ' sl-trigger--disabled' : ''}${this.isOpen() ? ' sl-trigger--open' : ''}`;
  }

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen.update(v => !v);
  }

  select(item: ITyroUiSelectItem): void {
    this.value = item.value;
    this.valueChange.emit(item.value);
    this.isOpen.set(false);
  }
}
