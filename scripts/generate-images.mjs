// node scripts/generate-images.mjs [--force]
//
// Génère des images DANS LES SOURCES (public/ de chaque site, à commiter) — lancé aussi par tyrobuild :
// - og-image.png : image de partage 1200×630 (Discord, LinkedIn, X…) = logo du site centré
//   sur un fond sombre avec deux halos aux couleurs de la marque (bleu/rouge du groupe, rose/bleu pour Vturias…)
// - icônes d'application sur fond blanc (icons/icon-192.png, icon-512.png, icon-maskable-512.png) + site.webmanifest :
//   nom, couleurs et icônes du site quand on l'ajoute à l'écran d'accueil (Android, Chrome, Edge…).
//   Les outils (IP, Speedtest, serveurs) utilisent leur icône Remix Icon du menu d'applications,
//   avec le dégradé de marque du media kit (#3366ff → #1900ff → #ff0000)
// - miniatures des fonds d'écran du media kit (aperçu ~60 Ko au lieu du 1080p de 1,5 Mo ;
//   les fichiers à télécharger restent les originaux en pleine qualité)
//
// Une image n'est régénérée que si elle manque, si sa source a changé ou si ce script a changé (--force : tout régénérer).

import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGOS = join(ROOT, 'projects/tyrolium-ui/src/styles/assets/projects');
const force = process.argv.includes('--force');

/**
 * Couleurs des images de partage : fond + halo en haut à gauche + halo en bas à droite
 * (dans le sens du dégradé des logos)
 */
const OG_THEMES = {
  /** Groupe Tyrolium : dégradé bleu → rouge des logos */
  tyrolium: { bg: '#0b0f1a', top: '#1d3bff', bottom: '#d0102b' },
  /** Vturias : rose → bleu clair (variables --vt-pink / --vt-blue du site) */
  vturias:  { bg: '#0d0a14', top: '#f472b6', bottom: '#7dd3fc' },
};

/** Dégradé des icônes du menu d'applications (media kit, .mk-icon-glyph : linear-gradient 135°) */
const GLYPH_GRADIENT = [[0, '#3366ff'], [0.25, '#1900ff'], [1, '#ff0000']];

/**
 * Logo (projects/tyrolium-ui/src/styles/assets/projects/<logo>.png) et thème de chaque site (défaut : tyrolium).
 * glyph : icône Remix Icon (node_modules/remixicon/icons/<glyph>.svg) pour les icônes d'application à la place du logo
 */
const OG_SITES = {
  'tyrolium-website':    'Tyrolium',
  'solidserv-website':   'SolidServ',
  'tyrociel-website':    'TyroCiel',
  'influnias-website':   'Influnias',
  'nexiumiacrm-website': 'NexiumiaCRM',
  'useritium-website':   'Useritium',
  'vturias-website':     { logo: 'Vturias', theme: 'vturias' },
  'gamenium-website':    'Gamenium',
  'tyroserv-website':    'TyroServ',
  'tyrolium-design':     'Tyrolium',
  'tyrolium-ip':         { logo: 'Tyrolium', glyph: 'Map/map-pin-user-fill' },
  'tyrolium-speedtest':  { logo: 'Tyrolium', glyph: 'Media/speed-up-fill' },
  'tyrolium-uptime':     { logo: 'Tyrolium', glyph: 'Device/server-fill' },
};

const WALLPAPERS = {
  source: join(ROOT, 'projects/tyrolium-website/public/assets/wallpapers'),
  target: join(ROOT, 'projects/tyrolium-website/public/assets/wallpapers-thumbs'),
  width:  800,
};

const OG_WIDTH  = 1200;
const OG_HEIGHT = 630;

/** À régénérer si absente, plus ancienne que sa source ou que ce script (couleurs, tailles…), ou si --force */
const SCRIPT = fileURLToPath(import.meta.url);
const outdated = (target, source) =>
  force || !existsSync(target)
  || statSync(target).mtimeMs < statSync(source).mtimeMs
  || statSync(target).mtimeMs < statSync(SCRIPT).mtimeMs;

/** Icône Remix Icon (SVG 24×24) dessinée en grand avec le dégradé de marque, en PNG transparent */
async function renderGlyph(svgFile) {
  const svg   = readFileSync(svgFile, 'utf8');
  const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"/g)].map(m => `<path d="${m[1]}" fill="url(#g)"/>`).join('');
  const stops = GLYPH_GRADIENT.map(([offset, color]) => `<stop offset="${offset}" stop-color="${color}"/>`).join('');
  return sharp(Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1024" height="1024">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs>
      ${paths}
    </svg>`)).png().toBuffer();
}

export async function generateImages() {
  let generated = 0;

  // ── Images de partage 1200×630 ─────────────────────────────────────
  for (const [project, entry] of Object.entries(OG_SITES)) {
    const { logo: logoName, theme = 'tyrolium' } = typeof entry === 'string' ? { logo: entry } : entry;
    const colors = OG_THEMES[theme];
    const logo   = join(LOGOS, `${logoName}.png`);
    const target = join(ROOT, 'projects', project, 'public', 'og-image.png');
    if (!outdated(target, logo)) continue;

    mkdirSync(dirname(target), { recursive: true });
    const background = Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">
        <defs>
          <radialGradient id="top" cx="18%" cy="15%" r="70%">
            <stop offset="0%"   stop-color="${colors.top}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${colors.top}" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="bottom" cx="85%" cy="90%" r="70%">
            <stop offset="0%"   stop-color="${colors.bottom}" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="${colors.bottom}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="${colors.bg}"/>
        <rect width="100%" height="100%" fill="url(#top)"/>
        <rect width="100%" height="100%" fill="url(#bottom)"/>
      </svg>`);
    // Logo contenu dans 820×380 : marge confortable, lisible même en petite vignette
    const logoBuffer = await sharp(logo).resize({ width: 820, height: 380, fit: 'inside' }).toBuffer();
    await sharp(background)
      .composite([{ input: logoBuffer, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(target);
    generated++;
  }

  // ── Icônes d'application (fond blanc) + site.webmanifest ───────────
  for (const [project, entry] of Object.entries(OG_SITES)) {
    const { logo: logoName, glyph } = typeof entry === 'string' ? { logo: entry } : entry;
    // Source de l'icône : le logo du site, ou l'icône Remix Icon des outils
    const source = glyph ? join(ROOT, 'node_modules/remixicon/icons', `${glyph}.svg`) : join(LOGOS, `${logoName}.png`);
    const image  = glyph ? await renderGlyph(source) : source;
    const icons  = join(ROOT, 'projects', project, 'public', 'icons');
    mkdirSync(icons, { recursive: true });

    // "any" : logo sur fond blanc, avec une marge (onglets, raccourcis, bureau)
    // "maskable" : Android découpe l'icône en rond / carré arrondi → logo dans la zone sûre (60 %)
    const variants = [
      { file: 'icon-192.png',          size: 192, ratio: 0.8 },
      { file: 'icon-512.png',          size: 512, ratio: 0.8 },
      { file: 'icon-maskable-512.png', size: 512, ratio: 0.6 },
    ];
    for (const { file, size, ratio } of variants) {
      const target = join(icons, file);
      if (!outdated(target, source)) continue;
      const inner = Math.round(size * ratio);
      const logo  = await sharp(image).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
      await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
        .composite([{ input: logo, gravity: 'center' }])
        .png({ compressionLevel: 9 })
        .toFile(target);
      generated++;
    }

    // Manifest : nom et description lus dans l'index.html du site (réécrit seulement s'il change)
    const index = readFileSync(join(ROOT, 'projects', project, 'src', 'index.html'), 'utf8');
    const meta  = (attr) => (index.match(new RegExp(`<meta ${attr} content="([^"]*)"`))?.[1] ?? '').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    const name  = meta('property="og:site_name"') || logoName;
    const manifest = JSON.stringify({
      id: '/',
      name,
      short_name: name,
      description: meta('name="description"'),
      lang: 'fr',
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#111827',
      background_color: '#ffffff',
      icons: [
        { src: '/icons/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }, null, 2) + '\n';
    const manifestFile = join(ROOT, 'projects', project, 'public', 'site.webmanifest');
    if (!existsSync(manifestFile) || readFileSync(manifestFile, 'utf8') !== manifest) {
      writeFileSync(manifestFile, manifest);
      generated++;
    }
  }

  // ── Miniatures des fonds d'écran (à partir des versions 1080p) ─────
  if (existsSync(WALLPAPERS.source)) {
    mkdirSync(WALLPAPERS.target, { recursive: true });
    for (const file of readdirSync(WALLPAPERS.source).filter(f => /-1080p\.png$/.test(f))) {
      const source = join(WALLPAPERS.source, file);
      const target = join(WALLPAPERS.target, basename(file, '-1080p.png') + '.jpg');
      if (!outdated(target, source)) continue;
      await sharp(source).resize({ width: WALLPAPERS.width }).jpeg({ quality: 80, mozjpeg: true }).toFile(target);
      generated++;
    }
  }

  return generated;
}

// Lancement direct : node scripts/generate-images.mjs [--force]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const generated = await generateImages();
  console.log(`✔ ${generated} fichier(s) généré(s) (images de partage, icônes + manifest, miniatures des fonds d'écran)`);
}
