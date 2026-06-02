import { Injectable, signal, inject, InjectionToken } from '@angular/core';
import { ITyroUiUser } from '../interface/ityro-ui-user';
import { TyroUiRelayService } from './tyro-ui-relay.service';

/**
 * URL de base de l'API Useritium.
 * Ex : { provide: TYRO_AUTH_API, useValue: 'https://api.useritium.fr' }
 */
export const TYRO_AUTH_API = new InjectionToken<string>('TYRO_AUTH_API', {
  providedIn: 'root',
  factory: () => 'https://api.useritium.fr',
});

const TOKEN_KEY = 'tyrolium-token';
const USER_KEY  = 'tyrolium-user';

@Injectable({ providedIn: 'root' })
export class TyroUiAuthService {
  private readonly apiUrl = inject(TYRO_AUTH_API);
  private readonly relay  = inject(TyroUiRelayService);

  readonly user    = signal<ITyroUiUser | null>(null);
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);
  readonly modalOpen = signal(false);
  readonly modalTab  = signal<'login' | 'register'>('login');

  constructor() {
    this.restoreSession();

    // Sync cross-domaine : token reçu via relay → restaure la session
    this.relay.on(TOKEN_KEY, (token, type) => {
      if (!token || localStorage.getItem(TOKEN_KEY) === token) return;
      localStorage.setItem(TOKEN_KEY, token);
    });

    this.relay.on(USER_KEY, (json, type) => {
      if (!json) return;
      try {
        const u: ITyroUiUser = JSON.parse(json);
        if (u?.email && !this.user()) {
          this.user.set(u);
          localStorage.setItem(USER_KEY, json);
        }
      } catch { /* json malformé */ }
    });
  }

  openModal(tab: 'login' | 'register' = 'login') {
    this.error.set(null);
    this.modalTab.set(tab);
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.error.set(null);
  }

  async login(email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? 'Identifiants incorrects.');
      }
      const data = await res.json();
      // Réponse attendue : { token: string, user: ITyroUiUser }
      this.storeSession(data.token, data.user ?? data);
      this.closeModal();
    } catch (e: any) {
      this.error.set(e?.message ?? 'Une erreur est survenue.');
    } finally {
      this.loading.set(false);
    }
  }

  async register(email: string, password: string, displayname: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayname }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? 'Erreur lors de la création du compte.');
      }
      const data = await res.json();
      this.storeSession(data.token, data.user ?? data);
      this.closeModal();
    } catch (e: any) {
      this.error.set(e?.message ?? 'Une erreur est survenue.');
    } finally {
      this.loading.set(false);
    }
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.relay.send(TOKEN_KEY, '');
    this.relay.send(USER_KEY, '');
    this.user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private storeSession(token: string, user: ITyroUiUser) {
    const json = JSON.stringify(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, json);
    this.relay.send(TOKEN_KEY, token);
    this.relay.send(USER_KEY, json);
    this.user.set(user);
  }

  private restoreSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const json  = localStorage.getItem(USER_KEY);
    if (token && json) {
      try { this.user.set(JSON.parse(json)); } catch { /* json corrompu */ }
    }
  }
}
