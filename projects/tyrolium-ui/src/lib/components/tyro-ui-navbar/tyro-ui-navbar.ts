import { Component, computed, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { ITyroUiNavbarPages } from '../../interface/ityro-ui-navbar-pages';
import { RouterLink } from '@angular/router';
import { ITyroUiNavbarMenuItem } from '../../interface/ityro-ui-navbar-menu-item';
import { ITyroUiNavbarMenuCategory } from '../../interface/ityro-ui-navbar-menu-category';
import { NavbarMenuCategory, NavbarMenuPinned } from '../../configs/menu-navbar';
import { TyroUiGloss } from '../../directive/tyro-ui-gloss';
import { TyroUiThemeService } from '../../services/tyro-ui-theme.service';
import { TyroUiLangService } from '../../services/tyro-ui-lang.service';
import { TyroUiAuthService } from '../../services/tyro-ui-auth.service';
import { TyroUiAuthModal } from '../tyro-ui-auth-modal/tyro-ui-auth-modal';

@Component({
  selector: 'tyro-ui-navbar',
  imports: [RouterLink, TyroUiGloss, TyroUiAuthModal],
  templateUrl: './tyro-ui-navbar.html',
  styleUrl: './tyro-ui-navbar.css',
})
export class TyroUiNavbar {
  @Input() project: string = '';
  @Input() logo: string = '';
  @Input() subtitle: string = '';
  @Input() pages: ITyroUiNavbarPages[] = [];
  @Input() placeholder: boolean = true;
  @Input() sidebar: boolean = false;
  /** @deprecated La session est gérée par TyroUiAuthService. Conserver pour rétrocompatibilité. */
  @Input() currentUser: any[] = [];

  public navbarMenuPinned: ITyroUiNavbarMenuItem = NavbarMenuPinned;
  public navbarMenuCategory: ITyroUiNavbarMenuCategory[] = NavbarMenuCategory;

  @Output() loginClick         = new EventEmitter<void>();
  @Output() registerClick      = new EventEmitter<void>();
  @Output() logoutClick        = new EventEmitter<void>();
  @Output() sidebarBurgerClick = new EventEmitter<void>();

  public menuOpen      = false;
  public menuPinned    = false;
  public langDropdownOpen = false;
  public mobileMenuOpen   = false;
  public userMenuOpen     = false;

  readonly themeService = inject(TyroUiThemeService);
  readonly langService  = inject(TyroUiLangService);
  readonly authService  = inject(TyroUiAuthService);

  /** Utilisateur effectif : auth service en priorité, puis currentUser input (legacy). */
  readonly effectiveUser = computed(() => {
    const u = this.authService.user();
    if (u) {
      const letter = (u.displayname || u.username).charAt(0).toUpperCase();
      const pp = u.pp
        ? `https://dashboard.useritium.fr/uploads/pp/${u.pp}`
        // ? `http://192.168.1.81/Useritium-Dashboard/uploads/pp/${u.pp}`
        : `https://tyrolium.fr/generate-pp/?c=183153&l=${letter}`
      return [{ name: u.displayname || u.username, email: u.email, urlPictureProfil: pp }];
    }
    return this.currentUser;
  });

  toggleMenu() {
    this.menuPinned = !this.menuPinned;
    this.menuOpen   = this.menuPinned;
  }

  onMenuMouseLeave() {
    if (!this.menuPinned) this.menuOpen = false;
  }

  closeMenu() {
    this.menuOpen   = false;
    this.menuPinned = false;
  }

  toggleLangDropdown() { this.langDropdownOpen = !this.langDropdownOpen; }

  setLang(lang: 'fr' | 'en') {
    this.langService.set(lang);
    this.langDropdownOpen = false;
  }

  toggleCategory(cat: ITyroUiNavbarMenuCategory) { cat.open = !cat.open; }

  toggleSubItems(item: ITyroUiNavbarMenuItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    item.subOpen = !item.subOpen;
  }

  getVisibleItems(items: ITyroUiNavbarMenuItem[]): ITyroUiNavbarMenuItem[] {
    const result: ITyroUiNavbarMenuItem[] = [];
    for (const item of items) {
      result.push(item);
      if (item.subOpen && item.subItems?.length) result.push(...item.subItems);
    }
    return result;
  }

  toggleMobileMenu() {
    if (this.sidebar) { this.sidebarBurgerClick.emit(); return; }
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  openAppsFromMobile() {
    this.mobileMenuOpen = false;
    this.menuOpen = true;
  }

  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }

  getUserInitials(): string {
    const user = this.effectiveUser();
    if (!user?.length) return '';
    const name = user[0]?.name || '';
    return name.split(' ').map((n: string) => n[0] || '').join('').toUpperCase().slice(0, 2);
  }

  onLoginClick() {
    this.userMenuOpen = false;
    this.authService.openModal('login');
    this.loginClick.emit();
  }

  onRegisterClick() {
    this.userMenuOpen = false;
    this.authService.openModal('register');
    this.registerClick.emit();
  }

  onLogoutClick() {
    this.authService.logout();
    this.userMenuOpen = false;
    this.logoutClick.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-menu-wrapper') && !target.closest('.nav-mobile-action')) {
      this.menuOpen = false;
      this.menuPinned = false;
    }
    if (!target.closest('.nav-lang-wrapper')) this.langDropdownOpen = false;
    if (!target.closest('.nav-user-wrapper') && !target.closest('.nav-user-mobile')) this.userMenuOpen = false;
    if (!target.closest('nav') && !target.closest('.nav-mobile-menu')) this.mobileMenuOpen = false;
  }

  scrollTo(ancre: string) {
    const element = document.getElementById(ancre);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  hrefLink(link: string) {
    window.location.href = link;
  }

  goToHref(href: string) {
    this.mobileMenuOpen = false;
    window.location.href = href;
  }


}
