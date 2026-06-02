import { Injectable, signal, inject } from '@angular/core';
import { TyroUiRelayService } from './tyro-ui-relay.service';

export type TyroLang = 'fr' | 'en';

const LANGS: TyroLang[] = ['fr', 'en'];
const KEY = 'tyrolium-lang';

@Injectable({ providedIn: 'root' })
export class TyroUiLangService {
  private readonly relay = inject(TyroUiRelayService);

  readonly lang = signal<TyroLang>('fr');

  constructor() {
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

    // Sync cross-domaine via relay
    this.relay.on(KEY, (value, type) => {
      const lang = value as TyroLang;
      if (!LANGS.includes(lang)) return;
      if (type === 'init') {
        if (!localStorage.getItem(KEY)) {
          this.lang.set(lang);
          localStorage.setItem(KEY, lang);
          this.applyDom(false);
        } else {
          this.relay.send(KEY, this.lang());
        }
      } else if (lang !== this.lang()) {
        this.lang.set(lang);
        localStorage.setItem(KEY, lang);
        this.applyDom(false);
      }
    });
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
    // Détection navigateur : français → 'fr', tout le reste → 'en'
    return navigator.language?.startsWith('fr') ? 'fr' : 'en';
  }

  private save(lang: TyroLang) {
    localStorage.setItem(KEY, lang);
    this.relay.send(KEY, lang);
  }
}
