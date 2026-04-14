import { Component, HostListener, Input } from '@angular/core';
import { ITyroUiNavbarPages } from '../../interface/ityro-ui-navbar-pages';
import { RouterLink } from '@angular/router';
import { ITyroUiNavbarMenuItem } from '../../interface/ityro-ui-navbar-menu-item';
import { ITyroUiNavbarMenuCategory } from '../../interface/ityro-ui-navbar-menu-category';
import { NavbarMenuCategory, NavbarMenuPinned } from '../../configs/menu-navbar';
import { TyroUiGloss } from '../../directive/tyro-ui-gloss';

@Component({
  selector: 'tyro-ui-navbar',
  imports: [RouterLink, TyroUiGloss],
  templateUrl: './tyro-ui-navbar.html',
  styleUrl: './tyro-ui-navbar.css',
})
export class TyroUiNavbar {
  @Input() project: string = ''; /* tyrolium / solidserv / gamenium / ... */
  @Input() logo: string = '';
  @Input() pages: ITyroUiNavbarPages[] = [];
  @Input() placeholder: boolean = true;

  public navbarMenuPinned: ITyroUiNavbarMenuItem = NavbarMenuPinned;
  public navbarMenuCategory: ITyroUiNavbarMenuCategory[] = NavbarMenuCategory;

  public menuOpen = false;

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleCategory(cat: ITyroUiNavbarMenuCategory) {
    cat.open = !cat.open;
  }

  toggleSubItems(item: ITyroUiNavbarMenuItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    item.subOpen = !item.subOpen;
  }

  getVisibleItems(items: ITyroUiNavbarMenuItem[]): ITyroUiNavbarMenuItem[] {
    const result: ITyroUiNavbarMenuItem[] = [];
    for (const item of items) {
      result.push(item);
      if (item.subOpen && item.subItems?.length) {
        result.push(...item.subItems);
      }
    }
    return result;
  }

  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.nav-menu-wrapper') && !target.closest('.nav-mobile-action')) {
      this.menuOpen = false;
    }

    if (!target.closest('nav') && !target.closest('.nav-mobile-menu')) {
      this.mobileMenuOpen = false;
    }
  }

  openAppsFromMobile() {
    this.mobileMenuOpen = false;
    this.menuOpen = true;
  }
}
