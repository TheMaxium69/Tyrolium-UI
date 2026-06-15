import { Injectable, signal, computed, inject } from '@angular/core';
import { TyroUiRelayService } from './tyro-ui-relay.service';

export type ThemeMode = 'auto' | 'light' | 'dark';

export { TYRO_RELAY_URL } from './tyro-ui-relay.service';

const MODES: ThemeMode[] = ['auto', 'light', 'dark'];
const KEY = 'tyrolium-theme';

@Injectable({ providedIn: 'root' })
export class TyroUiThemeService {
  private readonly relay = inject(TyroUiRelayService);

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
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this._systemDark.set(e.matches);
      this.applyDom(false);
    });

    this.mode.set(this.loadMode());
    this.applyDom(false);

    // Sync cross-tab même origine
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      const next = e.newValue as ThemeMode;
      if (MODES.includes(next) && next !== this.mode()) {
        this.mode.set(next);
        this.applyDom(false);
      }
    });

    // Sync cross-domaine via relay
    this.relay.on(KEY, (value, type) => {
      const mode = value as ThemeMode;
      if (!MODES.includes(mode)) return;
      if (type === 'init') {
        if (!localStorage.getItem(KEY)) {
          this.mode.set(mode);
          localStorage.setItem(KEY, mode);
          this.applyDom(false);
        } else {
          this.relay.send(KEY, this.mode());
        }
      } else if (mode !== this.mode()) {
        this.mode.set(mode);
        localStorage.setItem(KEY, mode);
        this.applyDom(false);
      }
    });
  }

  toggle() {
    if (!this.darkThemeEnabled()) return;
    const next = MODES[(MODES.indexOf(this.mode()) + 1) % MODES.length];
    this.mode.set(next);
    this.applyDom(true);
  }

  private applyDom(write: boolean) {
    const dark = this.isDark();
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = dark ? '#111827' : '#ffffff';
    if (write) this.save(this.mode());
  }

  private loadMode(): ThemeMode {
    const local = localStorage.getItem(KEY);
    if (local && MODES.includes(local as ThemeMode)) return local as ThemeMode;
    // Migration depuis l'ancienne clé 'tyro-theme'
    const legacy = localStorage.getItem('tyro-theme');
    if (legacy === 'dark' || legacy === 'light') {
      localStorage.removeItem('tyro-theme');
      return legacy;
    }
    return 'auto';
  }

  private save(mode: ThemeMode) {
    localStorage.setItem(KEY, mode);
    this.relay.send(KEY, mode);
  }
}
