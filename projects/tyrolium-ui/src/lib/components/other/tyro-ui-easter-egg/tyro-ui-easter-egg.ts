import { Component, signal, HostListener } from '@angular/core';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

@Component({
  selector: 'tyro-ui-easter-egg',
  imports: [],
  templateUrl: './tyro-ui-easter-egg.html',
  styleUrl: './tyro-ui-easter-egg.css',
})
export class TyroUiEasterEgg {
  readonly echecUrl  = 'https://themaxium69.github.io/Echec-ium/';
  readonly flappyUrl = 'https://themaxium69.github.io/Flappium/';
  readonly rythmUrl  = 'https://themaxium69.github.io/Clavium/';

  isOpen = signal(false);
  private progress = 0;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const key = e.key;
    if (key === KONAMI[this.progress]) {
      this.progress++;
      if (this.progress === KONAMI.length) {
        this.progress = 0;
        this.isOpen.set(true);
      }
    } else {
      this.progress = key === KONAMI[0] ? 1 : 0;
    }
  }

  @HostListener('document:keydown.escape')
  close() { this.isOpen.set(false); }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('ee-overlay')) {
      this.close();
    }
  }

  play(url: string) {
    if (url) window.open(url, '_blank', 'noopener');
  }
}
