import {
  EnvironmentProviders, Injectable, PLATFORM_ID, effect, inject, provideAppInitializer, signal,
} from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TyroUiLangService } from './tyro-ui-lang.service';
import { TYRO_UI_LANG_DATA, tyroUiLocalizeUrl, tyroUiUrlLang } from '../configs/localized-routes';

export interface TyroUiSeoText {
  fr: string;
  en: string;
}

/**
 * SEO d'une page, à mettre dans `data: { seo: {...} }` d'une route,
 * ou à passer à `TyroUiSeoService.set()` pour une page dynamique (ex. /labs/:slug).
 * Tout champ absent reprend la valeur par défaut de l'index.html.
 */
export interface TyroUiSeo {
  /** Titre de la page, sans le nom du site (ajouté automatiquement : "Équipe - Tyrolium") */
  title?: TyroUiSeoText;
  /** Titre complet, sans ajout du nom du site (page d'accueil) */
  fullTitle?: TyroUiSeoText;
  description?: TyroUiSeoText;
  /** URL absolue de l'image de partage (og:image / twitter:image) */
  image?: string;
  /** Exclut la page des moteurs de recherche (pages d'erreur, pages techniques…) */
  noindex?: boolean;
}

/** Statut HTTP porté par une page d'erreur pré-rendue (voir tyroUiErrorRoutes) */
export const TYRO_UI_STATUS_ATTR = 'data-tyro-status';

const DEFAULT_ATTR = 'data-tyro-default';

interface Defaults {
  title: string;
  description: string;
  image: string;
  robots: string;
  origin: string;
  siteName: string;
}

/**
 * Met à jour <title>, description, Open Graph, Twitter Card, canonical et robots à chaque navigation.
 * Sur un site en tyroUiLocalizedRoutes : ajoute aussi les hreflang FR/EN, og:locale, <html lang>,
 * et change d'URL (/equipe ↔ /en/equipe) quand l'utilisateur change de langue.
 * Fonctionne aussi au pré-rendu : chaque page générée embarque ses propres balises.
 * Les valeurs par défaut (et le nom du site) sont lues dans l'index.html du site.
 */
@Injectable({ providedIn: 'root' })
export class TyroUiSeoService {
  private readonly router   = inject(Router);
  private readonly title    = inject(Title);
  private readonly meta     = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly lang     = inject(TyroUiLangService).lang;
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

  private readonly routeSeo = signal<TyroUiSeo>({});
  private readonly override = signal<TyroUiSeo | null>(null);
  private readonly path     = signal('/');
  /** Rien n'est appliqué avant la 1re navigation : la page pré-rendue a déjà les bonnes balises */
  private ready = false;
  private readonly defaults = this.readDefaults();

  constructor() {
    this.router.events.subscribe((event) => {
      // Reset à NavigationStart : un composant peut appeler set() pendant l'activation, avant NavigationEnd
      if (event instanceof NavigationStart) this.override.set(null);
      if (event instanceof NavigationEnd) {
        const snapshot = this.router.routerState.snapshot.root;
        this.routeSeo.set(this.collect(snapshot));
        this.path.set(event.urlAfterRedirects.split(/[?#]/)[0]);
        if (this.isServer) this.markStatus(snapshot);
        this.ready = true;
        this.apply();
      }
    });

    // Changement de langue ou set() → on réapplique
    effect(() => this.apply());

    // Changement de langue (sélecteur, SSO, autre onglet) → URL de la page dans cette langue
    effect(() => {
      const lang = this.lang();
      if (this.isServer || !this.localized || !this.router.navigated) return;
      const url = this.router.url;
      if (tyroUiUrlLang(url) !== lang) this.router.navigateByUrl(tyroUiLocalizeUrl(url, lang));
    });
  }

  /** SEO d'une page dynamique (prioritaire sur les data de la route, jusqu'à la prochaine navigation) */
  set(seo: TyroUiSeo) {
    this.override.set(seo);
    this.apply();
  }

  private apply() {
    // Signaux lus avant tout retour anticipé : l'effect doit garder ses dépendances
    const seo  = { ...this.routeSeo(), ...(this.override() ?? {}) };
    const lang = this.lang();
    if (!this.ready) return;
    const d    = this.defaults;

    const title       = seo.fullTitle?.[lang] ?? (seo.title ? `${seo.title[lang]} - ${d.siteName}` : d.title);
    const description = seo.description?.[lang] ?? d.description;
    const image       = seo.image ?? d.image;
    const urlFor      = (path: string) => d.origin + (path === '/' ? '' : path);
    const url         = urlFor(this.path());

    this.title.setTitle(title);
    this.setMeta('name', 'description', description);
    this.setMeta('name', 'robots', seo.noindex ? 'noindex, nofollow' : d.robots);
    this.setMeta('property', 'og:title', title);
    this.setMeta('property', 'og:description', description);
    // Site sans domaine fixe (pas de canonical dans l'index.html) : pas d'URL absolue à publier
    if (d.origin) this.setMeta('property', 'og:url', url);
    this.setMeta('property', 'og:image', image);
    this.setMeta('name', 'twitter:title', title);
    this.setMeta('name', 'twitter:description', description);
    this.setMeta('name', 'twitter:image', image);
    if (d.origin) this.setCanonical(url);

    if (this.localized) {
      const frPath = tyroUiLocalizeUrl(this.path(), 'fr');
      this.document.documentElement.setAttribute('lang', tyroUiUrlLang(this.path()));
      this.setMeta('property', 'og:locale', lang === 'en' ? 'en_US' : 'fr_FR');
      this.setMeta('property', 'og:locale:alternate', lang === 'en' ? 'fr_FR' : 'en_US');
      if (d.origin) {
        this.setAlternate('fr', urlFor(frPath));
        this.setAlternate('en', urlFor(tyroUiLocalizeUrl(frPath, 'en')));
        this.setAlternate('x-default', urlFor(frPath));
      }
    }
  }

  /** Le site publie ses pages en /… et /en/… (tyroUiLocalizedRoutes) */
  private get localized(): boolean {
    return this.router.config.some(route => route.data?.[TYRO_UI_LANG_DATA]);
  }

  /** Fusionne les data.seo de la route racine jusqu'à la route la plus profonde */
  private collect(snapshot: ActivatedRouteSnapshot): TyroUiSeo {
    let seo: TyroUiSeo = {};
    let route: ActivatedRouteSnapshot | null = snapshot;
    while (route) {
      if (route.data['seo']) seo = { ...seo, ...route.data['seo'] };
      route = route.firstChild;
    }
    return seo;
  }

  /** Pré-rendu des pages d'erreur : <html data-tyro-status="403|404">, relu au démarrage côté navigateur */
  private markStatus(snapshot: ActivatedRouteSnapshot) {
    let route: ActivatedRouteSnapshot | null = snapshot;
    let status: number | undefined;
    while (route) {
      status = route.data['tyroStatus'] ?? status;
      route = route.firstChild;
    }
    const html = this.document.documentElement;
    if (status) html.setAttribute(TYRO_UI_STATUS_ATTR, String(status));
    else html.removeAttribute(TYRO_UI_STATUS_ATTR);
  }

  private setMeta(attr: 'name' | 'property', key: string, content: string) {
    if (!content) return;
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  private setAlternate(hreflang: string, url: string) {
    let link = this.document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setCanonical(url: string) {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * Valeurs de l'index.html du site. Une page pré-rendue a déjà ses propres balises :
   * l'original est donc conservé dans data-tyro-default pour être relu côté navigateur.
   */
  private readDefaults(): Defaults {
    const head = this.document.head;
    const keep = (el: Element | null, attr: string | null) => {
      if (!el) return '';
      const value = el.getAttribute(DEFAULT_ATTR) ?? (attr ? el.getAttribute(attr) : el.textContent) ?? '';
      el.setAttribute(DEFAULT_ATTR, value);
      return value;
    };
    const title = keep(head.querySelector('title'), null);
    return {
      title,
      description: keep(head.querySelector('meta[name="description"]'), 'content'),
      image:       keep(head.querySelector('meta[property="og:image"]'), 'content'),
      robots:      keep(head.querySelector('meta[name="robots"]'), 'content') || 'index, follow',
      origin:      keep(head.querySelector('link[rel="canonical"]'), 'href').replace(/\/+$/, ''),
      siteName:    head.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || title.split(' - ')[0],
    };
  }
}

/** À ajouter dans les providers de app.config.ts */
export function provideTyroUiSeo(): EnvironmentProviders {
  return provideAppInitializer(() => { inject(TyroUiSeoService); });
}
