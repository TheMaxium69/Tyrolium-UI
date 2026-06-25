import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';

export type TyroUiTextFieldVariant = 'outlined' | 'filled' | 'standard';
export type TyroUiTextFieldType    = 'text' | 'password' | 'number' | 'date' | 'email' | 'tel';

let _tfCounter = 0;

@Component({
  selector: 'tyro-ui-text-field',
  imports: [NgClass],
  templateUrl: './tyro-ui-text-field.html',
  styleUrl: './tyro-ui-text-field.css',
})
export class TyroUiTextField implements OnChanges {
  @Input() variant:       TyroUiTextFieldVariant = 'outlined';
  @Input() type:          TyroUiTextFieldType    = 'text';
  @Input() value         = '';
  @Input() label?:       string;
  @Input() placeholder?: string;
  @Input() icon?:        string;
  @Input() disabled      = false;
  @Input() error         = false;
  @Input() errorMessage?: string;

  @Output() valueChange = new EventEmitter<string>();

  readonly inputId = `tyro-tf-${++_tfCounter}`;

  /* ─── Internal state ───────────────────────── */
  protected inputValue   = '';
  protected isFocused    = false;
  protected showPassword = false;

  get currentType(): string {
    return this.type === 'password' && this.showPassword ? 'text' : this.type;
  }

  get labelFloating(): boolean {
    return this.isFocused || !!this.inputValue;
  }

  get wrapperClass(): string {
    const parts = [
      `tf-wrapper--${this.variant}`,
      this.isFocused  ? 'tf-wrapper--focused'  : '',
      this.error      ? 'tf-wrapper--error'     : '',
      this.disabled   ? 'tf-wrapper--disabled'  : '',
    ];
    return parts.filter(Boolean).join(' ');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.inputValue = this.value ?? '';
    }
  }

  protected onInput(e: Event): void {
    this.inputValue = (e.target as HTMLInputElement).value;
    this.valueChange.emit(this.inputValue);
  }

  protected onFocus(): void  { this.isFocused = true; }
  protected onBlur(): void   { this.isFocused = false; }
}
