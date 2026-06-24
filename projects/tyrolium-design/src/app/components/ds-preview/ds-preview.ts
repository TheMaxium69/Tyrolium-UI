import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ds-preview',
  templateUrl: './ds-preview.html',
  styleUrl: './ds-preview.css',
})
export class DsPreview {
  @Input() label?: string;
  @Input() minHeight?: string;
}
