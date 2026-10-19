// node scripts/generate-sitemap.mjs <projet> [dossier-prod]
//   ex. : node scripts/generate-sitemap.mjs tyrolium-website prod/Tyrolium-WebSite
//
// Génère sitemap.xml et robots.txt dans dist/<projet>/browser à partir des pages pré-rendues
// (lancé automatiquement par tyrobuild, après le build).
//
// - Domaine : lu dans le <link rel="canonical"> de l'index.html du site
// - Pages exclues : celles en noindex (403, 404…) et les pages de redirection
// - robots.txt : pages d'erreur en Disallow (elles répondent déjà 403 / 404, autant ne pas les explorer)
// - Chaque page FR est liée à sa version /en/ (hreflang), si elle existe
// - <lastmod> : date du build si le contenu de la page a changé depuis la version du dossier prod,
//   sinon la date du sitemap précédent (Google ignore un lastmod qui change à chaque build)
// - Site entièrement en noindex : robots.txt seulement, sans sitemap

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Date du jour au format du sitemap (heure locale) : 2026-10-19 */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Contenu d'une page sans ce qui change à chaque build (noms de fichiers hashés, styles, scripts, ids Angular) */
const content = (html) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
  .replace(/\b(main|styles|chunk|polyfills)-[A-Z0-9]+\.(js|css)/g, '')
  .replace(/\s_ng(content|host)-ng-c\d+(="")?/g, '')
  .replace(/\sng-version="[^"]*"/g, '')
  .replace(/\s+/g, ' ');

/**
 * @param project angular.json (ex. tyrolium-website)
 * @param previous dossier du dernier déploiement (ex. prod/Tyrolium-WebSite) : sert à dater les pages inchangées
 * @param robots   chemins à toujours ajouter en Disallow (ex. ['/Download/'])
 */
export function generateSitemap(project, previous, robots = []) {
  const dist   = join(ROOT, 'dist', project, 'browser');
  const routes = join(ROOT, 'dist', project, 'prerendered-routes.json');
  if (!existsSync(routes)) throw new Error(`${routes} introuvable : le site n'est pas pré-rendu`);

  const page   = (path) => readFileSync(join(dist, path === '/' ? '' : path, 'index.html'), 'utf8');
  const home   = page('/');
  const origin = (home.match(/<link rel="canonical" href="([^"]+)"[^>]*data-tyro-default="([^"]+)"/)?.[2]
               ?? home.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '').replace(/\/+$/, '');
  if (!origin) throw new Error(`aucun <link rel="canonical"> dans l'index.html de ${project}`);

  const indexable = (html) =>
    !/<meta name="robots" content="[^"]*noindex/.test(html) && !/<title>Redirecting<\/title>/.test(html);

  const all   = Object.keys(JSON.parse(readFileSync(routes, 'utf8')).routes).sort();
  const paths = all.filter(path => indexable(page(path)));
  // Pages d'erreur pré-rendues (/403, /404, /en/403…) : inutile de les explorer
  const errors = all.filter(path => /data-tyro-status="\d+"/.test(page(path)));

  const url     = (path) => origin + (path === '/' ? '' : path);
  const isEn    = (path) => /^\/en(\/|$)/.test(path);
  const enOf    = (path) => (path === '/' ? '/en' : '/en' + path);
  const frOf    = (path) => path.replace(/^\/en/, '') || '/';

  // lastmod précédents, lus dans le sitemap déjà déployé
  const previousMods = new Map();
  const previousSitemap = previous && join(previous, 'sitemap.xml');
  if (previousSitemap && existsSync(previousSitemap)) {
    for (const [, loc, mod] of readFileSync(previousSitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>/g)) {
      previousMods.set(loc, mod);
    }
  }
  let changed = 0;
  const lastmod = (path) => {
    const old = previous && join(previous, path === '/' ? '' : path, 'index.html');
    const unchanged = old && existsSync(old) && content(readFileSync(old, 'utf8')) === content(page(path));
    if (!unchanged) changed++;
    return (unchanged && previousMods.get(url(path))) || today();
  };

  let sitemap = false;
  if (paths.length) {
    const entries = paths.map(path => {
      const fr = isEn(path) ? frOf(path) : path;
      const en = enOf(fr);
      const alternates = paths.includes(fr) && paths.includes(en) ? `
    <xhtml:link rel="alternate" hreflang="fr" href="${url(fr)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${url(en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(fr)}"/>` : '';
      return `  <url>
    <loc>${url(path)}</loc>
    <lastmod>${lastmod(path)}</lastmod>${alternates}
  </url>`;
    });
    writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`);
    sitemap = true;
  }

  const disallow = [...robots, ...errors.map(path => `${path}/`)].map(path => `Disallow: ${path}\n`).join('');
  writeFileSync(join(dist, 'robots.txt'), sitemap
    ? `User-agent: *\n${disallow}\nSitemap: ${origin}/sitemap.xml\n`
    // Site en noindex : on laisse explorer pour que les moteurs lisent la balise noindex et désindexent
    : `# Site non référencé : chaque page porte <meta name="robots" content="noindex">\nUser-agent: *\n${disallow || 'Allow: /\n'}`);

  return { origin, pages: paths.length, changed, sitemap };
}

// Lancement direct : node scripts/generate-sitemap.mjs <projet>
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [project, previous] = process.argv.slice(2);
  if (!project) {
    console.log('Usage : node scripts/generate-sitemap.mjs <projet angular.json> [dossier-prod]');
    process.exit(1);
  }
  const { origin, pages, changed, sitemap } = generateSitemap(project, previous && join(ROOT, previous));
  console.log(sitemap ? `✔ sitemap.xml (${pages} pages, ${changed} modifiée(s) depuis le dernier déploiement) + robots.txt pour ${origin}` : `✔ robots.txt (site en noindex) pour ${origin}`);
}
