import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TyroSsoService } from './tyro-ui-sso.service';

export type TyroLang = 'fr' | 'en';

const LANGS: TyroLang[] = ['fr', 'en'];
const KEY = 'tyrolium-lang';

@Injectable({ providedIn: 'root' })
export class TyroUiLangService {
  private readonly sso = inject(TyroSsoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lang = signal<TyroLang>('fr');

  constructor() {
    // Pré-rendu serveur : on génère la version FR, la langue réelle est appliquée côté navigateur
    if (!this.isBrowser) return;

    this.lang.set(this.loadLang());
    this.applyDom(false);

    // Sync cross-tab même origine
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      const next = e.newValue as TyroLang;
      if (LANGS.includes(next) && next !== this.lang()) {
        this.lang.set(next);
        this.applyDom(false);
      }
    });

    // Sync cross-domaine via SSO
    this.sso.on('lang', (value, type) => {
      const lang = value as TyroLang;
      if (value && !LANGS.includes(lang)) return;
      if (type === 'init') {
        if (value) {
          // SSO a une langue → l'appliquer
          this.lang.set(lang);
          localStorage.setItem(KEY, lang);
          this.applyDom(false);
        } else if (localStorage.getItem(KEY)) {
          // SSO vide, on a une langue locale → la pousser vers SSO
          this.sso.post('lang', this.lang());
        }
      } else if (value && lang !== this.lang()) {
        this.lang.set(lang);
        localStorage.setItem(KEY, lang);
        this.applyDom(false);
      }
    });
  }

  /** Langue enregistrée par l'utilisateur (sélecteur, SSO) ; null si elle n'est que déduite du navigateur */
  storedLang(): TyroLang | null {
    if (!this.isBrowser) return null;
    const local = localStorage.getItem(KEY) as TyroLang | null;
    return local && LANGS.includes(local) ? local : null;
  }

  /** Langue imposée par l'URL (/en/…) : appliquée sans être enregistrée comme préférence */
  useUrlLang(lang: TyroLang) {
    this.lang.set(lang);
  }

  set(lang: TyroLang) {
    this.lang.set(lang);
    this.applyDom(true);
  }

  private applyDom(write: boolean) {
    document.documentElement.setAttribute('lang', this.lang());
    if (write) this.save(this.lang());
  }

  private loadLang(): TyroLang {
    const local = localStorage.getItem(KEY);
    if (local && LANGS.includes(local as TyroLang)) return local as TyroLang;
    // Migration depuis l'ancienne clé 'tyro-lang'
    const legacy = localStorage.getItem('tyro-lang') as TyroLang | null;
    if (legacy && LANGS.includes(legacy)) {
      localStorage.removeItem('tyro-lang');
      return legacy;
    }
    return navigator.language?.startsWith('fr') ? 'fr' : 'en';
  }

  private save(lang: TyroLang) {
    localStorage.setItem(KEY, lang);
    this.sso.post('lang', lang);
  }
}
