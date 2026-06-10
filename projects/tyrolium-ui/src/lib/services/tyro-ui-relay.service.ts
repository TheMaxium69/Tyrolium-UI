import { Injectable, inject, InjectionToken } from '@angular/core';

/**
 * Fournir ce token sur les sites tiers pour activer la sync cross-domaine
 * via la page relay hébergée sur tyrolium.fr.
 * En dev : 'http://192.168.1.81:PORT/relay.html'
 * En prod : TYRO_RELAY_PAGE_URL
 */
export const TYRO_RELAY_URL = new InjectionToken<string>('TYRO_RELAY_URL', {
  providedIn: 'root',
  factory: () => '',
});

type RelayHandler = (value: string, type: 'init' | 'changed') => void;

// Ordre de dispatch garanti à l'init : logout et login-at en premier pour que
// les handlers auth puissent bloquer token/user si besoin
const PRIORITY_KEYS = ['tyrolium-logout', 'tyrolium-login-at'];

@Injectable({ providedIn: 'root' })
export class TyroUiRelayService {
  private readonly relayUrl = inject(TYRO_RELAY_URL);

  private frame: HTMLIFrameElement | null = null;
  private origin = '';
  private handlers = new Map<string, RelayHandler[]>();

  constructor() {
    if (this.relayUrl) this.init();
  }

  /** Enregistre un handler appelé quand la clé change via le relay. */
  on(key: string, handler: RelayHandler) {
    if (!this.handlers.has(key)) this.handlers.set(key, []);
    this.handlers.get(key)!.push(handler);
  }

  /** Stocke une valeur dans le relay (localStorage de tyrolium.fr). */
  send(key: string, value: string) {
    this.frame?.contentWindow?.postMessage(
      { type: 'tyro-relay-set', key, value },
      this.origin || '*'
    );
  }

  /** Supprime une clé du relay (localStorage de tyrolium.fr). */
  remove(key: string) {
    this.frame?.contentWindow?.postMessage(
      { type: 'tyro-relay-remove', key },
      this.origin || '*'
    );
  }

  private init() {
    try {
      this.origin = new URL(this.relayUrl).origin;
    } catch {
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = this.relayUrl;
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'display:none;position:fixed;width:0;height:0;border:0;top:0;left:0';

    window.addEventListener('message', (e: MessageEvent) => {
      if (e.origin !== this.origin) return;
      const d = e.data;
      if (!d) return;

      if (d.type === 'tyro-relay-init' && d.data) {
        // Dispatch les clés prioritaires en premier (logout, login-at) puis les autres
        for (const key of PRIORITY_KEYS) {
          if (d.data[key]) this.dispatch(key, d.data[key], 'init');
        }
        for (const [key, value] of Object.entries<string>(d.data)) {
          if (PRIORITY_KEYS.includes(key)) continue;
          if (value) this.dispatch(key, value, 'init');
        }
      } else if (d.type === 'tyro-relay-changed' && d.key && 'value' in d) {
        this.dispatch(d.key, d.value ?? '', 'changed');
      }
    });

    const append = () => document.body.appendChild(iframe);
    document.body ? append() : document.addEventListener('DOMContentLoaded', append);
    this.frame = iframe;
  }

  private dispatch(key: string, value: string, type: 'init' | 'changed') {
    this.handlers.get(key)?.forEach(h => h(value, type));
  }
}
