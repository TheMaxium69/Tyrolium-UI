import { inject } from '@angular/core';
import { CanActivateChildFn, Router, Routes } from '@angular/router';
import { TyroLang, TyroUiLangService } from '../services/tyro-ui-lang.service';

/** Marqueur posé sur les deux arbres de routes (voir tyroUiLocalizedRoutes) */
export const TYRO_UI_LANG_DATA = 'tyroLang';

/** Langue portée par une URL : /en/… → 'en', tout le reste → 'fr' */
export function tyroUiUrlLang(url: string): TyroLang {
  return /^\/en(?=[/?#]|$)/.test(url) ? 'en' : 'fr';
}

/** Même page dans l'autre langue : /equipe ↔ /en/equipe (query et fragment conservés) */
export function tyroUiLocalizeUrl(url: string, lang: TyroLang): string {
  let base = url.replace(/^\/en(?=[/?#]|$)/, '');
  if (!base.startsWith('/')) base = '/' + base;
  if (lang === 'fr') return base;
  if (base === '/') return '/en';
  return /^\/[?#]/.test(base) ? '/en' + base.slice(1) : '/en' + base;
}

/**
 * Garde l'URL et la langue d'accord :
 * - 1er chargement : l'URL fait foi (/en/… → anglais), sauf si l'utilisateur a enregistré une autre langue
 *   (sélecteur, SSO) → redirection vers la même page dans sa langue
 *   (un robot n'a pas de préférence enregistrée : il reste sur la page demandée)
 * - navigations suivantes : la langue choisie fait foi, les liens "/equipe" deviennent "/en/equipe" en anglais
 */
const langGuard = (urlLang: TyroLang): CanActivateChildFn => (_child, state) => {
  const router = inject(Router);
  const langs  = inject(TyroUiLangService);

  if (!router.navigated) {
    const stored = langs.storedLang();
    if (stored && stored !== urlLang) return router.parseUrl(tyroUiLocalizeUrl(state.url, stored));
    langs.useUrlLang(urlLang);
    return true;
  }

  const lang = langs.lang();
  return lang === urlLang ? true : router.parseUrl(tyroUiLocalizeUrl(state.url, lang));
};

/**
 * Publie chaque page en français (/equipe) et en anglais (/en/equipe).
 * Usage : `export const routes: Routes = tyroUiLocalizedRoutes([ … ]);`
 * Les liens existants ("/equipe") n'ont pas à changer : la garde ajoute /en quand la langue est l'anglais.
 */
export function tyroUiLocalizedRoutes(routes: Routes): Routes {
  return [
    { path: 'en', canActivateChild: [langGuard('en')], data: { [TYRO_UI_LANG_DATA]: 'en' }, children: routes },
    { path: '',   canActivateChild: [langGuard('fr')], data: { [TYRO_UI_LANG_DATA]: 'fr' }, children: routes },
  ];
}
