import { Injectable, signal, inject, InjectionToken } from '@angular/core';
import { ITyroUiUser } from '../interface/ityro-ui-user';
import { TyroUiRelayService } from './tyro-ui-relay.service';
import { TyroUiLangService } from './tyro-ui-lang.service';

/**
 * URL de base de l'API Useritium.
 * Ex : { provide: TYRO_AUTH_API, useValue: 'https://useritium.fr/api-externe' }
 */
export const TYRO_AUTH_API = new InjectionToken<string>('TYRO_AUTH_API', {
  providedIn: 'root',
  factory: () => 'http://192.168.1.81/ApiUseritium',
});

const TOKEN_KEY    = 'tyrolium-token';
const USER_KEY     = 'tyrolium-user';
const LOGOUT_KEY   = 'tyrolium-logout';
const LOGIN_AT_KEY = 'tyrolium-login-at';

interface UseritiumResponse {
  status: string;
  why: string;
  result?: ITyroUiUser;
}

@Injectable({ providedIn: 'root' })
export class TyroUiAuthService {
  private readonly apiUrl = inject(TYRO_AUTH_API);
  private readonly relay  = inject(TyroUiRelayService);
  private readonly lang   = inject(TyroUiLangService).lang;

  readonly user      = signal<ITyroUiUser | null>(null);
  readonly loading   = signal(false);
  readonly error     = signal<string | null>(null);
  readonly modalOpen = signal(false);
  readonly modalTab  = signal<'login' | 'register'>('login');

  // Timestamp de déco reçu via relay : bloque reconnectWithToken tant qu'un nouveau login ne l'a pas réinitialisé
  private logoutSignaledAt = 0;

  constructor() {
    this.restoreSession();
    this.listenRelay();
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

  async login(loginUseritium: string, mdpUseritium: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const body = new URLSearchParams({
        login_useritium: loginUseritium,
        mdp_useritium: mdpUseritium,
      });
      const res = await fetch(`${this.apiUrl}/?controller=WebSite&task=connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const data: UseritiumResponse = await res.json();
      if (data.status !== 'true' || !data.result) {
        this.error.set(this.translateLoginError(data.why));
        return;
      }
      this.storeSession(data.result.webToken, data.result);
      this.closeModal();
    } catch {
      const fr = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      const en = 'Unable to reach the server. Please check your connection.';
      this.error.set(this.lang() === 'en' ? en : fr);
    } finally {
      this.loading.set(false);
    }
  }

  async reconnectWithToken(token: string): Promise<boolean> {
    if (this.logoutSignaledAt > 0) return false;
    try {
      const body = new URLSearchParams({ webtoken_useritium: token });
      const res = await fetch(`${this.apiUrl}/?controller=WebSite&task=connectToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const data: UseritiumResponse = await res.json();
      if (data.status !== 'true' || !data.result) {
        this.clearSession();
        return false;
      }
      // Vérifie qu'un logout relay n'est pas arrivé pendant l'appel réseau
      if (this.logoutSignaledAt > 0) {
        this.clearSession();
        return false;
      }
      this.storeSession(data.result.webToken, data.result);
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    const now = Date.now().toString();
    this.clearSession();
    this.relay.send(LOGOUT_KEY, now);
    this.relay.remove(TOKEN_KEY);
    this.relay.remove(USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private listenRelay() {
    // 1. Signal de déconnexion — dispatché en premier par le relay init
    this.relay.on(LOGOUT_KEY, (value) => {
      if (!value) return;
      const logoutAt = parseInt(value, 10);
      const loginAt  = parseInt(localStorage.getItem(LOGIN_AT_KEY) ?? '0', 10);
      if (logoutAt > loginAt) {
        this.logoutSignaledAt = logoutAt;
        localStorage.setItem(LOGOUT_KEY, value); // persiste localement pour les prochains reloads
        this.clearSession();
      }
    });

    // 2. Timestamp du dernier login — dispatché en deuxième par le relay init
    //    Si un nouveau login a eu lieu après le logout, on réinitialise le flag
    this.relay.on(LOGIN_AT_KEY, (value) => {
      if (!value) return;
      const loginAt = parseInt(value, 10);
      if (loginAt > this.logoutSignaledAt) {
        this.logoutSignaledAt = 0;
      }
    });

    // 3. Token — traité en dernier ; bloqué si logoutSignaledAt est toujours actif
    this.relay.on(TOKEN_KEY, (token) => {
      if (token === '') {
        this.clearSession();
        return;
      }
      if (!token || this.logoutSignaledAt > 0) return;
      if (localStorage.getItem(TOKEN_KEY) === token) return;
      localStorage.setItem(TOKEN_KEY, token);
      this.reconnectWithToken(token);
    });

    this.relay.on(USER_KEY, (json) => {
      if (!json || this.logoutSignaledAt > 0) return;
      try {
        const u: ITyroUiUser = JSON.parse(json);
        if (u?.email && !this.user()) {
          this.user.set(u);
          localStorage.setItem(USER_KEY, json);
        }
      } catch { /* json malformé */ }
    });
  }

  private translateLoginError(why?: string): string {
    const fr: Record<string, string> = {
      'bad password':        'Mot de passe incorrect.',
      'non-existent account': 'Aucun compte ne correspond à cet identifiant.',
      'indefinite fields':   'Veuillez remplir tous les champs.',
    };
    const en: Record<string, string> = {
      'bad password':        'Incorrect password.',
      'non-existent account': 'No account matches this identifier.',
      'indefinite fields':   'Please fill in all fields.',
    };
    const map = this.lang() === 'en' ? en : fr;
    return map[why ?? ''] ?? (this.lang() === 'en' ? 'An error occurred.' : 'Une erreur est survenue.');
  }

  private storeSession(token: string, user: ITyroUiUser) {
    const loginAt = Date.now().toString();
    const json = JSON.stringify(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, json);
    localStorage.setItem(LOGIN_AT_KEY, loginAt);
    localStorage.removeItem(LOGOUT_KEY); // un nouveau login annule l'ancien signal de déco
    this.logoutSignaledAt = 0;
    this.relay.send(TOKEN_KEY, token);
    this.relay.send(USER_KEY, json);
    this.relay.send(LOGIN_AT_KEY, loginAt);
    this.user.set(user);
  }

  private clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
  }

  private restoreSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    // Vérifie le signal de déco local avant de tenter une reconnexion
    const logoutAt = parseInt(localStorage.getItem(LOGOUT_KEY) ?? '0', 10);
    const loginAt  = parseInt(localStorage.getItem(LOGIN_AT_KEY) ?? '0', 10);
    if (logoutAt > loginAt) {
      this.clearSession();
      return;
    }

    // Affiche le cache immédiatement pour l'UX, puis valide côté serveur
    const json = localStorage.getItem(USER_KEY);
    if (json) {
      try { this.user.set(JSON.parse(json)); } catch { /* json corrompu */ }
    }

    this.reconnectWithToken(token);
  }
}
