import { Injectable, signal, computed, inject, InjectionToken } from '@angular/core';

export type ThemeMode = 'auto' | 'light' | 'dark';

const MODES: ThemeMode[] = ['auto', 'light', 'dark'];
const KEY = 'tyrolium-theme';

/**
 * Fournir ce token pour activer le partage de thème via cookie sur un domaine parent commun.
 * Ex : { provide: TYRO_COOKIE_DOMAIN, useValue: '.tyrolium.fr' }
 * Utile uniquement pour des sous-domaines du même TLD.
 */
export const TYRO_COOKIE_DOMAIN = new InjectionToken<string>('TYRO_COOKIE_DOMAIN', {
  providedIn: 'root',
  factory: () => '',
});

/**
 * Fournir ce token sur les sites tiers (ex: solidserv.fr) pour activer la sync cross-domaine
 * via la page relay hébergée sur tyrolium.fr.
 * Ex : { provide: TYRO_RELAY_URL, useValue: TYRO_THEME_RELAY_URL }
 * Ne pas fournir sur tyrolium.fr lui-même (il est le relay).
 */
export const TYRO_RELAY_URL = new InjectionToken<string>('TYRO_RELAY_URL', {
  providedIn: 'root',
  factory: () => '',
});

@Injectable({ providedIn: 'root' })
export class TyroUiThemeService {
  private readonly cookieDomain = inject(TYRO_COOKIE_DOMAIN);
  private readonly relayUrl = inject(TYRO_RELAY_URL);

  private relayFrame: HTMLIFrameElement | null = null;
  private relayOrigin = '';

  private readonly _systemDark = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

  readonly mode = signal<ThemeMode>('auto');

  readonly isDark = computed(() => {
    const m = this.mode();
    if (m === 'dark') return true;
    if (m === 'light') return false;
    return this._systemDark();
  });

  readonly darkThemeEnabled = signal<boolean>(true);

  constructor() {
    // Suit la préférence système (utile en mode auto)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) => {
      this._systemDark.set(e.matches);
      this.applyDom(false);
    });

    // Charge la préférence : localStorage → cookie → 'auto'
    this.mode.set(this.loadMode());
    this.applyDom(false);

    // Sync cross-tab même origine via l'event storage (natif, automatique)
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      const next = e.newValue as ThemeMode;
      if (MODES.includes(next) && next !== this.mode()) {
        this.mode.set(next);
        this.applyDom(false);
      }
    });

    // Sync cross-domaine via relay iframe (si TYRO_RELAY_URL fourni)
    if (this.relayUrl) {
      this.setupRelay(this.relayUrl);
    }
  }

  toggle() {
    if (!this.darkThemeEnabled()) return;
    const next = MODES[(MODES.indexOf(this.mode()) + 1) % MODES.length];
    this.mode.set(next);
    this.applyDom(true);
  }

  private applyDom(write: boolean) {
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
    if (write) this.save(this.mode());
  }

  private loadMode(): ThemeMode {
    const local = localStorage.getItem(KEY);
    if (local && MODES.includes(local as ThemeMode)) return local as ThemeMode;
    // Migration depuis l'ancienne clé 'tyro-theme' (2 états seulement)
    const legacy = localStorage.getItem('tyro-theme');
    if (legacy === 'dark' || legacy === 'light') {
      localStorage.removeItem('tyro-theme');
      return legacy;
    }
    return this.readCookie() ?? 'auto';
  }

  private save(mode: ThemeMode) {
    localStorage.setItem(KEY, mode);
    // Cookie pour cross-sous-domaine (si TYRO_COOKIE_DOMAIN fourni)
    const domain = this.cookieDomain ? `; domain=${this.cookieDomain}` : '';
    document.cookie = `${KEY}=${mode}; path=/; max-age=31536000; SameSite=Lax${domain}`;
    // Sync vers le relay iframe (cross-domaine séparé)
    this.relayFrame?.contentWindow?.postMessage({ type: 'tyro-theme-set', mode }, this.relayOrigin);
  }

  private setupRelay(url: string) {
    try {
      this.relayOrigin = new URL(url).origin;
    } catch {
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'display:none;position:fixed;width:0;height:0;border:0;top:0;left:0';

    // Écoute les messages du relay
    window.addEventListener('message', (e: MessageEvent) => {
      if (e.origin !== this.relayOrigin) return;
      const data = e.data;
      if (!data || !MODES.includes(data.mode)) return;

      if (data.type === 'tyro-theme-init') {
        // Relay vient de charger : si pas de préf locale, on adopte celle de tyrolium.fr
        const hasLocal = !!localStorage.getItem(KEY);
        if (!hasLocal) {
          this.mode.set(data.mode as ThemeMode);
          localStorage.setItem(KEY, data.mode);
          this.applyDom(false);
        } else {
          // On a une préf locale → on la pousse vers le relay
          this.relayFrame?.contentWindow?.postMessage(
            { type: 'tyro-theme-set', mode: this.mode() },
            this.relayOrigin
          );
        }
      } else if (data.type === 'tyro-theme-changed') {
        // Un autre onglet a changé le thème
        if (data.mode !== this.mode()) {
          this.mode.set(data.mode as ThemeMode);
          localStorage.setItem(KEY, data.mode);
          this.applyDom(false);
        }
      }
    });

    const append = () => document.body.appendChild(iframe);
    document.body ? append() : document.addEventListener('DOMContentLoaded', append);
    this.relayFrame = iframe;
  }

  private readCookie(): ThemeMode | null {
    const match = document.cookie.match(/(?:^|;\s*)tyrolium-theme=([^;]+)/);
    const val = match?.[1];
    return val && MODES.includes(val as ThemeMode) ? (val as ThemeMode) : null;
  }
}
