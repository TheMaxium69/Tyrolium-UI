import {
  Component, computed, HostListener, inject, Input, signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ITyroUiDashNavItem, ITyroUiDashNavChild } from '../../../interface/ityro-ui-dash-nav-item';
import { TyroUiThemeService } from '../../../services/tyro-ui-theme.service';
import { TyroUiAuthService } from '../../../services/tyro-ui-auth.service';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';
import {TyroUiNavbar} from "../../showcase/tyro-ui-navbar/tyro-ui-navbar";

@Component({
  selector: 'tyro-ui-dashboard-layout',
    imports: [RouterLink, RouterLinkActive, TyroUiNavbar],
  templateUrl: './tyro-ui-dashboard-layout.html',
  styleUrl: './tyro-ui-dashboard-layout.css',
})
export class TyroUiDashboardLayout {
  /** Nom du projet affiché dans la topbar et la sidebar (ex : "Useritium"). */
  @Input() project = '';
  /** Logo affiché dans la sidebar et la topbar. */
  @Input() logo    = '';
  @Input() logoWhite    = '';
  /** Libellé utilitaire affiché sous le projet dans la sidebar (ex : "Dashboard", "Panel"). */
  @Input() utility = '';
  @Input() requireLogin = true;
  @Input() navItems: ITyroUiDashNavItem[] = [];

  currentYear: number = new Date().getFullYear();

  readonly themeService = inject(TyroUiThemeService);
  readonly authService  = inject(TyroUiAuthService);
  readonly langService  = inject(TyroUiLangService);

  sidebarCollapsed = signal(false);
  mobileOpen       = signal(false);
  userMenuOpen     = false;
  langDropdownOpen = false;

  readonly effectiveUser = computed(() => {
    const u = this.authService.user();
    if (u) {
      const letter = (u.displayname || u.username).charAt(0).toUpperCase();
      const pp = u.pp
        ? `https://dashboard.useritium.fr/uploads/pp/${u.pp}`
        : `https://tyrolium.fr/generate-pp/?c=183153&l=${letter}`;
      return [{ name: u.displayname || u.username, email: u.email, urlPictureProfil: pp }];
    }
    return [];
  });

  get initials(): string {
    const u = this.effectiveUser();
    if (!u.length) return '';
    return (u[0].name || '').split(' ').map((n: string) => n[0] || '').join('').toUpperCase().slice(0, 2);
  }

  toggleSidebar()  { this.sidebarCollapsed.update(v => !v); }
  toggleMobile()   { this.mobileOpen.update(v => !v); }
  closeMobile()    { this.mobileOpen.set(false); }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }
  toggleLang()     { this.langDropdownOpen = !this.langDropdownOpen; }
  setLang(lang: 'fr' | 'en') { this.langService.set(lang); this.langDropdownOpen = false; }
  toggleGroup(item: ITyroUiDashNavItem) { item.open = !item.open; }
  toggleChild(child: ITyroUiDashNavChild) { child.open = !child.open; }

  onLogoutClick() {
    this.authService.logout();
    this.userMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dl-user-wrapper'))  this.userMenuOpen     = false;
    if (!target.closest('.dl-lang-wrapper'))  this.langDropdownOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.mobileOpen.set(false); }
}
