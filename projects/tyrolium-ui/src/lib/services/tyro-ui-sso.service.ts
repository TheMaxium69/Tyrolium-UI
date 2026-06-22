import { Injectable } from '@angular/core';

const SSO_BASE = 'https://sso.tyrolium.fr';
const UUID_KEY = '_tyro_uuid';
const POLL_MS  = 15_000;

export type SsoKey = 'theme' | 'lang' | 'token';
type Handler = (value: string | null, type: 'init' | 'changed') => void;

@Injectable({ providedIn: 'root' })
export class TyroSsoService {
  private uuid: string | null = null;
  private handlers = new Map<SsoKey, Handler[]>();
  private last: Partial<Record<SsoKey, string | null>> = {};
  private initRetried = false;

  constructor() { this.boot(); }

  on(key: SsoKey, handler: Handler): void {
    const list = this.handlers.get(key) ?? [];
    list.push(handler);
    this.handlers.set(key, list);
  }

  post(key: SsoKey, value: string | null): void {
    if (!this.uuid) return;
    const body = new URLSearchParams({ uuid: this.uuid, key, value: value ?? '' });
    fetch(`${SSO_BASE}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).catch(() => {});
  }

  private async boot(): Promise<void> {
    // UUID passé dans l'URL par le hub → sauvegarder et nettoyer
    const params  = new URLSearchParams(window.location.search);
    const urlUuid = params.get(UUID_KEY);
    if (urlUuid) {
      localStorage.setItem(UUID_KEY, urlUuid);
      params.delete(UUID_KEY);
      const qs = params.toString();
      window.history.replaceState(
        {},
        '',
        window.location.pathname + (qs ? '?' + qs : '') + window.location.hash,
      );
    }

    this.uuid = localStorage.getItem(UUID_KEY);

    // Pas d'UUID → redirect vers le hub (qui reviendra avec ?_tyro_uuid=...)
    if (!this.uuid) {
      window.location.href =
        `${SSO_BASE}/hub?return=${encodeURIComponent(window.location.href)}`;
      return;
    }

    await this.loadState('init');
    setInterval(() => this.loadState('changed'), POLL_MS);
  }

  private async loadState(type: 'init' | 'changed'): Promise<void> {
    if (!this.uuid) return;
    try {
      const res  = await fetch(`${SSO_BASE}/state?uuid=${encodeURIComponent(this.uuid)}`);
      const data = await res.json();

      // UUID introuvable en DB : soit expiré, soit race condition juste après hub
      if (data.status === 'err' && data.why === 'uuid not found' && type === 'init') {
        if (this.initRetried) {
          // Vraiment expiré → redemander un UUID propre
          localStorage.removeItem(UUID_KEY);
          this.uuid = null;
          window.location.href =
            `${SSO_BASE}/hub?return=${encodeURIComponent(window.location.href)}`;
        } else {
          // Peut-être un race condition (INSERT pas encore committé) → retry dans 1s
          this.initRetried = true;
          setTimeout(() => this.loadState('init'), 1000);
        }
        return;
      }

      if (data.status !== 'ok') return;

      const state = data.data as Record<SsoKey, string | null>;
      for (const key of ['theme', 'lang', 'token'] as SsoKey[]) {
        const value = state[key] ?? null;
        if (type === 'init' || value !== this.last[key]) {
          this.last[key] = value;
          this.handlers.get(key)?.forEach(h => h(value, type));
        }
      }
    } catch { /* réseau, on réessaiera au prochain poll */ }
  }
}
