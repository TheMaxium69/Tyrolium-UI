// node scripts/generate-txt.mjs <projet>       ex. : node scripts/generate-txt.mjs tyrolium-website
//
// Génère dans dist/<projet>/browser (lancé automatiquement par tyrobuild, après le sitemap) :
// - llms.txt   : présentation du site pour les IA (ChatGPT, Claude, Perplexité…), format llmstxt.org :
//                résumé + liste des pages avec leur description, lues dans les pages pré-rendues
//                (même titre / description que pour Google), + les autres sites du groupe
// - humans.txt : qui a fait le site et avec quoi (humanstxt.org)
// - .well-known/security.txt : à qui signaler une faille de sécurité (RFC 9116)
//
// Rien n'est écrit à la main : tout vient des index.html et des pages pré-rendues.
// Site en noindex (ex. page par défaut d'un serveur) : humans.txt seulement.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FOUNDER = 'Maxime Tournier';
const CONTACT = 'contact@tyrolium.fr';
const TWITTER = '@TyroliumE';

/** Sections du llms.txt : 1er segment d'URL → titre de section (le reste va dans « Pages ») */
const SECTIONS = {
  prestation:      'Prestations',
  labs:            'Labs',
  'etudes-de-cas': 'Études de cas',
  talent:          'Talents',
  produit:         'Produits',
  showcase:        'Composants - Vitrine',
  dashboard:       'Composants - Dashboard',
  modal:           'Composants - Modales',
  page:            'Composants - Pages',
  other:           'Composants - Autres',
};
/** Pages secondaires (section « Optional » du format : une IA peut les ignorer) */
const OPTIONAL = /^\/legal\//;

const decode = (text) => text
  .replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();

/** Nom, domaine, description, robots d'un site, lus dans son index.html (sources) */
function siteInfo(project) {
  const html = readFileSync(join(ROOT, 'projects', project, 'src', 'index.html'), 'utf8');
  const meta = (attr) => decode(html.match(new RegExp(`<meta ${attr} content="([^"]*)"`))?.[1] ?? '');
  return {
    project,
    name:        meta('property="og:site_name"') || decode(html.match(/<title>([^<]*)/)?.[1] ?? project),
    title:       decode(html.match(/<title>([^<]*)/)?.[1] ?? ''),
    description: meta('name="description"'),
    origin:      (html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '').replace(/\/+$/, ''),
    noindex:     /<meta name="robots" content="[^"]*noindex/.test(html),
  };
}

/**
 * Projets absents de la section « Groupe Tyrolium » : ce ne sont pas des filiales
 * (librairie, outils internes, back-offices, pages techniques)
 */
const NOT_IN_GROUP = [
  'tyrolium-ui', 'tyrolium-hub', 'useritium-dashboard', 'template-website', 'tyrolium-uptime',
  'tyrolium-ip', 'tyrolium-speedtest', 'tyrolium-design', 'tyrolium-maintenance',
];

/** Les autres sites du groupe (filiales indexables, avec un domaine) */
function ecosystem(current) {
  return readdirSync(join(ROOT, 'projects'))
    .filter(project => project !== current && existsSync(join(ROOT, 'projects', project, 'src', 'index.html')))
    .filter(project => !NOT_IN_GROUP.includes(project))
    .map(siteInfo)
    .filter(site => site.origin && !site.noindex)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function generateTxt(project) {
  const dist = join(ROOT, 'dist', project, 'browser');
  const site = siteInfo(project);
  const routesFile = join(ROOT, 'dist', project, 'prerendered-routes.json');

  // ── Pages pré-rendues (FR), sans erreurs / redirections / noindex ──────────────
  const pages = [];
  if (existsSync(routesFile)) {
    for (const path of Object.keys(JSON.parse(readFileSync(routesFile, 'utf8')).routes).sort()) {
      if (/^\/en(\/|$)/.test(path)) continue;
      const html = readFileSync(join(dist, path === '/' ? '' : path, 'index.html'), 'utf8');
      if (/<meta name="robots" content="[^"]*noindex/.test(html) || /<title>Redirecting<\/title>/.test(html)) continue;
      const title = decode(html.match(/<title[^>]*>([^<]*)/)?.[1] ?? path).replace(new RegExp(` - ${site.name}$`), '');
      const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
      pages.push({ path, title, description, url: site.origin + (path === '/' ? '' : path) });
    }
  }
  // Version anglaise : pages /en/ pré-rendues, ou routes en tyroUiLocalizedRoutes (site non pré-rendu)
  const routesSource = join(ROOT, 'projects', project, 'src', 'app', 'app.routes.ts');
  const hasEnglish = existsSync(join(dist, 'en', 'index.html'))
    || (existsSync(routesSource) && readFileSync(routesSource, 'utf8').includes('tyroUiLocalizedRoutes'));
  // Dernière mise à jour = page modifiée le plus récemment (lastmod du sitemap) : la date ne bouge pas si rien ne change
  const sitemap = join(dist, 'sitemap.xml');
  const lastmod = existsSync(sitemap)
    ? (readFileSync(sitemap, 'utf8').match(/<lastmod>[^<]+<\/lastmod>/g) ?? []).map(tag => tag.slice(9, 19)).sort().pop()
    : undefined;

  // ── llms.txt ───────────────────────────────────────────────────────────────────
  let llms = false;
  if (!site.noindex && pages.length) {
    const line = (page) => `- [${page.title}](${page.url})${page.description ? `: ${page.description}` : ''}`;
    const groups = new Map();
    for (const page of pages.filter(p => p.path !== '/' && !OPTIONAL.test(p.path))) {
      const section = SECTIONS[page.path.split('/')[1]] ?? 'Pages';
      if (!groups.has(section)) groups.set(section, []);
      groups.get(section).push(page);
    }
    const optional = pages.filter(p => OPTIONAL.test(p.path));
    const home = pages.find(p => p.path === '/');
    const others = ecosystem(project);

    const sections = [...groups.entries()]
      .sort(([a], [b]) => (a === 'Pages' ? -1 : b === 'Pages' ? 1 : 0))
      .map(([title, list]) => `## ${title}\n\n${list.map(line).join('\n')}`);

    writeFileSync(join(dist, 'llms.txt'), [
      `# ${site.name}`,
      `> ${site.description}`,
      [
        `Site officiel : ${site.origin}${home ? ` (page d'accueil : ${home.title})` : ''}.`,
        hasEnglish ? `Chaque page existe en français et en anglais : version anglaise = même adresse précédée de /en (ex. ${site.origin}/en).` : '',
        `Fait partie du groupe Tyrolium, holding technologique française fondée en 2017 par ${FOUNDER}. Contact : ${CONTACT}.`,
      ].filter(Boolean).join('\n'),
      ...sections,
      others.length ? `## Groupe Tyrolium\n\n${others.map(o => `- [${o.name}](${o.origin}): ${o.description}`).join('\n')}` : '',
      optional.length ? `## Optional\n\n${optional.map(line).join('\n')}` : '',
    ].filter(Boolean).join('\n\n') + '\n');
    llms = true;
  }

  // ── humans.txt ─────────────────────────────────────────────────────────────────
  const date = (lastmod ?? new Date().toISOString().slice(0, 10)).replace(/-/g, '/');
  writeFileSync(join(dist, 'humans.txt'), `/* TEAM */
    Fondateur, développeur : ${FOUNDER}
    Contact : ${CONTACT}
    X : ${TWITTER}
    Équipe : https://tyrolium.fr/equipe
    Localisation : France

/* SITE */
    Site : ${site.name}${site.origin ? ` - ${site.origin}` : ''}
${site.origin === 'https://tyrolium.fr' ? '' : '    Groupe : Tyrolium - https://tyrolium.fr\n'}    Dernière mise à jour : ${date}
    Langues : Français${hasEnglish ? ', English' : ''}
    Standards : HTML5, CSS3, TypeScript
    Composants : Angular, Tyrolium UI - https://design.tyrolium.fr
    Logiciels : Angular CLI, sharp, Remix Icon
`);

  // ── .well-known/security.txt (RFC 9116) ───────────────────────────────────────
  // Expires obligatoire (moins d'un an conseillé) : 1er du mois, 11 mois plus tard.
  // Ne change qu'une fois par mois ; un site redéployé au moins tous les 11 mois reste valide.
  const now = new Date();
  const expires = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 11, 1)).toISOString().replace('.000Z', 'Z');
  mkdirSync(join(dist, '.well-known'), { recursive: true });
  writeFileSync(join(dist, '.well-known', 'security.txt'), [
    '# Une faille de sécurité sur ce site ? Merci de nous l\'écrire avant de la rendre publique.',
    '# Found a security issue on this site? Please tell us before making it public.',
    `Contact: mailto:${CONTACT}`,
    `Expires: ${expires}`,
    'Preferred-Languages: fr, en',
    ...(site.origin ? [`Canonical: ${site.origin}/.well-known/security.txt`] : []),
  ].join('\n') + '\n');

  return { llms, pages: pages.length };
}

// Lancement direct : node scripts/generate-txt.mjs <projet>
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const project = process.argv[2];
  if (!project) {
    console.log('Usage : node scripts/generate-txt.mjs <projet angular.json>');
    process.exit(1);
  }
  const { llms, pages } = generateTxt(project);
  console.log(llms ? `✔ llms.txt (${pages} pages) + humans.txt + security.txt` : '✔ humans.txt + security.txt (site en noindex : pas de llms.txt)');
}
