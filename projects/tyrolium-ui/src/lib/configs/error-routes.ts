import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { TyroUiForbidden } from '../components/page/tyro-ui-forbidden/tyro-ui-forbidden';
import { TyroUiNotFound } from '../components/page/tyro-ui-not-found/tyro-ui-not-found';
import { TyroUiGone } from '../components/page/tyro-ui-gone/tyro-ui-gone';
import { TYRO_UI_STATUS_ATTR, TyroUiSeo } from '../services/tyro-ui-seo.service';

const SEO_403: TyroUiSeo = {
  title:       { fr: 'Accès refusé', en: 'Access denied' },
  description: { fr: "Vous n'avez pas accès à cette page.", en: 'You do not have access to this page.' },
  noindex: true,
};

const SEO_410: TyroUiSeo = {
  title:       { fr: 'Page supprimée', en: 'Page removed' },
  description: { fr: 'Cette page a été supprimée définitivement.', en: 'This page has been permanently removed.' },
  noindex: true,
};

const SEO_404: TyroUiSeo = {
  title:       { fr: 'Page introuvable', en: 'Page not found' },
  description: { fr: "Cette page n'existe pas ou a été déplacée.", en: 'This page does not exist or has been moved.' },
  noindex: true,
};

/**
 * Le serveur (Apache / Nginx) répond avec le vrai code HTTP (403 / 404 / 410) et le HTML pré-rendu de /403, /404 ou /410.
 * Au démarrage, Angular voit l'URL demandée (ex. /assets/) : on relit le statut posé au pré-rendu
 * pour afficher la bonne page, uniquement à la première navigation.
 */
const initialStatusIs = (status: number) => () =>
  !inject(Router).navigated &&
  inject(DOCUMENT).documentElement.getAttribute(TYRO_UI_STATUS_ATTR) === String(status);

/**
 * Routes d'erreur communes, à placer en fin de tableau de routes :
 * `...tyroUiErrorRoutes()` remplace `{ path: '403', … }` et `{ path: '**', … }`.
 * 410 (Gone) : page supprimée définitivement, les URLs concernées sont listées côté serveur ("gone" dans tyrobuild).
 */
export function tyroUiErrorRoutes(): Routes {
  return [
    { path: '403', component: TyroUiForbidden, data: { seo: SEO_403, tyroStatus: 403 } },
    { path: '404', component: TyroUiNotFound,  data: { seo: SEO_404, tyroStatus: 404 } },
    { path: '410', component: TyroUiGone,      data: { seo: SEO_410, tyroStatus: 410 } },
    { path: '**',  component: TyroUiForbidden, data: { seo: SEO_403 }, canMatch: [initialStatusIs(403)] },
    { path: '**',  component: TyroUiGone,      data: { seo: SEO_410 }, canMatch: [initialStatusIs(410)] },
    { path: '**',  component: TyroUiNotFound,  data: { seo: SEO_404 } },
  ];
}
