import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tyro-ui-switch',
  templateUrl: './tyro-ui-switch.html',
  styleUrl: './tyro-ui-switch.css',
})
export class TyroUiSwitch {
  @Input() value    = false;
  @Input() disabled = false;
  @Input() label?:  string;

  @Output() valueChange = new EventEmitter<boolean>();

  toggle(): void {
    if (this.disabled) return;
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }
}
