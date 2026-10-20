// node scripts/generate-rss.mjs <projet> <section> <fichier> "<titre>"
//   ex. : node scripts/generate-rss.mjs tyrolium-website /etudes-de-cas/ rss.xml "Tyrolium - Études de cas"
//
// Génère un flux RSS 2.0 dans dist/<projet>/browser (lancé automatiquement par tyrobuild, option "rss") :
// un article par page pré-rendue de la section (en français) qui a une date de publication
// (<meta property="article:published_time">, posée par TyroUiSeoService.set({ publishedAt })).
// Titre = titre affiché de la page (h1), résumé = meta description, du plus récent au plus ancien.

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const decode = (text) => text
  .replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Date RSS (RFC 822) à minuit UTC : Sat, 26 Sep 2026 00:00:00 GMT */
const rssDate = (day) => new Date(`${day}T00:00:00Z`).toUTCString();

/**
 * @param project angular.json (ex. tyrolium-website)
 * @param options section (ex. '/etudes-de-cas/'), file (ex. 'rss.xml'), title (titre du flux)
 */
export function generateRss(project, { section, file = 'rss.xml', title }) {
  const dist   = join(ROOT, 'dist', project, 'browser');
  const routes = Object.keys(JSON.parse(readFileSync(join(ROOT, 'dist', project, 'prerendered-routes.json'), 'utf8')).routes);
  const page   = (path) => readFileSync(join(dist, path === '/' ? '' : path, 'index.html'), 'utf8');
  const meta   = (html, attr) => decode(html.match(new RegExp(`<meta ${attr} content="([^"]*)"`))?.[1] ?? '');

  const home   = page('/');
  const origin = (home.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '').replace(/\/+$/, '');
  const listingPath = section.replace(/\/$/, '');
  const listing = existsSync(join(dist, listingPath, 'index.html')) ? page(listingPath) : home;

  const items = routes
    .filter(path => path.startsWith(section))
    .map(path => {
      const html = page(path);
      const publishedAt = meta(html, 'property="article:published_time"');
      if (!publishedAt) return null;
      return {
        title:       decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '') ?? meta(html, 'property="og:title"')),
        description: meta(html, 'name="description"'),
        url:         origin + path,
        publishedAt,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));

  // Date du flux = article le plus récent : le fichier ne change que si le contenu change
  const lastBuild = items[0]?.publishedAt;
  const feedUrl   = `${origin}/${file}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(title)}</title>
    <link>${origin}${listingPath}</link>
    <description>${escape(meta(listing, 'name="description"'))}</description>
    <language>fr</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>${lastBuild ? `
    <lastBuildDate>${rssDate(lastBuild)}</lastBuildDate>` : ''}
    <image>
      <url>${origin}/og-image.png</url>
      <title>${escape(title)}</title>
      <link>${origin}${listingPath}</link>
    </image>
${items.map(item => `    <item>
      <title>${escape(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escape(item.description)}</description>
      <pubDate>${rssDate(item.publishedAt)}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;
  writeFileSync(join(dist, file), xml);
  return { items: items.length, file };
}

// Lancement direct : node scripts/generate-rss.mjs <projet> <section> <fichier> "<titre>"
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [project, section, file, title] = process.argv.slice(2);
  if (!project || !section || !title) {
    console.log('Usage : node scripts/generate-rss.mjs <projet> <section> <fichier> "<titre>"');
    process.exit(1);
  }
  const { items } = generateRss(project, { section, file, title });
  console.log(`✔ ${file} (${items} articles)`);
}
