import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TyroUiThemeService {
  readonly isDark = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('tyro-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved !== null ? saved === 'dark' : prefersDark;
    this.applyTheme(dark);
  }

  toggle() {
    this.applyTheme(!this.isDark());
  }

  private applyTheme(dark: boolean) {
    this.isDark.set(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('tyro-theme', dark ? 'dark' : 'light');
  }
}
