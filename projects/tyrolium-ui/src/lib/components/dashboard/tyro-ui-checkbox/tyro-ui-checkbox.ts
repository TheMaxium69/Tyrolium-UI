import { Component, EventEmitter, Input, Output } from '@angular/core';

let _cbCounter = 0;

@Component({
  selector: 'tyro-ui-checkbox',
  templateUrl: './tyro-ui-checkbox.html',
  styleUrl: './tyro-ui-checkbox.css',
})
export class TyroUiCheckbox {
  @Input() value    = false;
  @Input() disabled = false;
  @Input() label?:  string;

  @Output() valueChange = new EventEmitter<boolean>();

  readonly inputId = `tyro-cb-${++_cbCounter}`;

  toggle(): void {
    if (this.disabled) return;
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }
}
