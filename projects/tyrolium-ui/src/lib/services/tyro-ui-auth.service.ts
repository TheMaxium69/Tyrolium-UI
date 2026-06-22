import { Injectable, signal, inject, InjectionToken } from '@angular/core';
import { ITyroUiUser } from '../interface/ityro-ui-user';
import { TyroSsoService } from './tyro-ui-sso.service';
import { TyroUiLangService } from './tyro-ui-lang.service';

export const TYRO_AUTH_API = new InjectionToken<string>('TYRO_AUTH_API', {
  providedIn: 'root',
  factory: () => 'https://api.useritium.fr',
});

const TOKEN_KEY = 'tyrolium-token';
const USER_KEY  = 'tyrolium-user';

interface UseritiumResponse {
  status: string;
  why: string;
  result?: ITyroUiUser;
}

@Injectable({ providedIn: 'root' })
export class TyroUiAuthService {
  private readonly apiUrl = inject(TYRO_AUTH_API);
  private readonly sso    = inject(TyroSsoService);
  private readonly lang   = inject(TyroUiLangService).lang;

  readonly user      = signal<ITyroUiUser | null>(null);
  readonly loading   = signal(false);
  readonly error     = signal<string | null>(null);
  readonly modalOpen = signal(false);
  readonly modalTab  = signal<'login' | 'register'>('login');

  constructor() {
    this.restoreSession();
    this.listenSso();
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
      // Si le token a été effacé pendant l'appel async (logout d'un autre site)
      if (!localStorage.getItem(TOKEN_KEY)) {
        this.clearSession();
        return false;
      }
      this.storeSession(data.result.webToken, data.result, false);
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    this.clearSession();
    this.sso.post('token', '');
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private listenSso() {
    this.sso.on('token', (token) => {
      if (!token) {
        // Token effacé sur un autre site → déconnexion
        this.clearSession();
        return;
      }
      if (localStorage.getItem(TOKEN_KEY) === token) return;
      localStorage.setItem(TOKEN_KEY, token);
      this.reconnectWithToken(token);
    });
  }

  private translateLoginError(why?: string): string {
    const fr: Record<string, string> = {
      'bad password':         'Mot de passe incorrect.',
      'non-existent account': 'Aucun compte ne correspond à cet identifiant.',
      'indefinite fields':    'Veuillez remplir tous les champs.',
    };
    const en: Record<string, string> = {
      'bad password':         'Incorrect password.',
      'non-existent account': 'No account matches this identifier.',
      'indefinite fields':    'Please fill in all fields.',
    };
    const map = this.lang() === 'en' ? en : fr;
    return map[why ?? ''] ?? (this.lang() === 'en' ? 'An error occurred.' : 'Une erreur est survenue.');
  }

  /**
   * @param syncSso false lors d'un reconnect déclenché par SSO (token déjà connu du serveur)
   */
  private storeSession(token: string, user: ITyroUiUser, syncSso = true) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (syncSso) this.sso.post('token', token);
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

    const json = localStorage.getItem(USER_KEY);
    if (json) {
      try { this.user.set(JSON.parse(json)); } catch { /* json corrompu */ }
    }

    this.reconnectWithToken(token);
  }
}
