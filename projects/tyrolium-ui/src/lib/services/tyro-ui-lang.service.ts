import { Injectable, signal } from '@angular/core';

export type TyroLang = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class TyroUiLangService {
  readonly lang = signal<TyroLang>('fr');

  constructor() {
    const saved = localStorage.getItem('tyro-lang') as TyroLang | null;
    const detected = (navigator.language || 'fr').startsWith('en') ? 'en' : 'fr';
    this.applyLang(saved ?? detected);
  }

  set(lang: TyroLang) {
    this.applyLang(lang);
  }

  private applyLang(lang: TyroLang) {
    this.lang.set(lang);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('tyro-lang', lang);
  }
}
