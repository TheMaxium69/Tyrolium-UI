// node scripts/generate-images.mjs [--force]
//
// Génère des images DANS LES SOURCES (public/ de chaque site, à commiter) — lancé aussi par tyrobuild :
// - og-image.png : image de partage 1200×630 (Discord, LinkedIn, X…) = logo du site centré
//   sur un fond sombre avec deux halos aux couleurs de la marque (bleu/rouge du groupe, rose/bleu pour Vturias…)
// - miniatures des fonds d'écran du media kit (aperçu ~60 Ko au lieu du 1080p de 1,5 Mo ;
//   les fichiers à télécharger restent les originaux en pleine qualité)
//
// Une image n'est régénérée que si elle manque, si sa source a changé ou si ce script a changé (--force : tout régénérer).

import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
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

/** Logo (projects/tyrolium-ui/src/styles/assets/projects/<logo>.png) et thème de chaque site (défaut : tyrolium) */
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
  'tyrolium-ip':         'Tyrolium',
  'tyrolium-speedtest':  'Tyrolium',
  'tyrolium-uptime':     'Tyrolium',
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
  console.log(`✔ ${generated} image(s) générée(s) (images de partage + miniatures des fonds d'écran)`);
}
