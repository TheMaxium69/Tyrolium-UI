// node scripts/optimize-images.mjs <projet> [--skip dossier/ …]
//   ex. : node scripts/optimize-images.mjs tyrolium-website --skip assets/wallpapers/
//
// Optimise les images du build (dist/<projet>/browser), jamais les sources de public/ ni de tyrolium-ui
// (lancé automatiquement par tyrobuild, après le build) :
// - redimensionne ce qui dépasse 2048 px (le media kit exporte jusqu'à 2160 px : on ne descend pas en dessous)
//   La version WebP, elle, ne sert qu'à l'affichage dans les pages : limitée à 1200 px
//   (l'export du media kit récupère le PNG : sa requête n'annonce pas le WebP)
// - recompresse PNG (sans perte) et JPEG (mozjpeg), seulement si le résultat est plus léger
// - crée une version WebP à côté (logo.png → logo.png.webp), servie par Apache / Nginx
//   aux navigateurs qui l'acceptent (négociation sur l'en-tête Accept), sans toucher aux pages
//
// Résultats mis en cache (.angular/tyro-images/) : une image identique n'est traitée qu'une fois,
// d'un build à l'autre et d'un site à l'autre (les logos de tyrolium-ui sont dans chaque site).

import sharp from 'sharp';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, '.angular', 'tyro-images');

const MAX_SIZE = 2048;
const WEBP_MAX_SIZE = 1200;
/** À changer quand les réglages changent : invalide le cache */
const SETTINGS = 'v2-2048-png9-jpg82-webp82-1200';
/** Le WebP n'est gardé que s'il fait gagner au moins 10 % */
const WEBP_MIN_GAIN = 0.9;
/** media/ = polices et fichiers du build déjà nommés avec un hash */
const ALWAYS_SKIP = ['media/'];

/**
 * @param project angular.json (ex. tyrolium-website)
 * @param skip    dossiers (relatifs au build) à laisser intacts, ex. ['assets/wallpapers/'] (téléchargements en pleine qualité)
 */
export async function optimizeImages(project, skip = []) {
  const dist = join(ROOT, 'dist', project, 'browser');
  if (!existsSync(dist)) throw new Error(`${dist} introuvable : lancer le build d'abord`);
  mkdirSync(CACHE, { recursive: true });

  const ignored = [...ALWAYS_SKIP, ...skip];
  const files = walk(dist)
    .filter(file => /\.(png|jpe?g)$/i.test(file))
    .filter(file => !ignored.some(dir => relative(dist, file).startsWith(dir)));

  let before = 0, after = 0, webp = 0;
  for (const file of files) {
    const result = await optimize(file);
    before += result.before;
    after  += result.after;
    webp   += result.webp;
  }
  return { files: files.length, before, after, webp };
}

/** Une image : version optimisée (même nom) + éventuel .webp, depuis le cache si déjà traitée */
async function optimize(file) {
  const input = readFileSync(file);
  const key   = createHash('sha1').update(SETTINGS).update(input).digest('hex');
  const jpeg  = /\.jpe?g$/i.test(file);
  const main  = join(CACHE, key + (jpeg ? '.jpg' : '.png'));
  const alt   = join(CACHE, key + '.webp');
  const none  = join(CACHE, key + '.nowebp');

  if (!existsSync(main)) {
    let image = sharp(input, { failOn: 'none' }).rotate();
    const { width = 0, height = 0 } = await image.metadata();
    if (Math.max(width, height) > MAX_SIZE) {
      image = image.resize({ width: MAX_SIZE, height: MAX_SIZE, fit: 'inside', withoutEnlargement: true });
    }
    const resized = await image.toBuffer();
    const smaller = jpeg
      ? await sharp(resized).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
      : await sharp(resized).png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true }).toBuffer();
    // Pas plus léger (déjà optimisée) : on garde l'original tel quel
    writeFileSync(main, smaller.length < input.length ? smaller : input);

    const webpBuffer = await sharp(resized)
      .resize({ width: WEBP_MAX_SIZE, height: WEBP_MAX_SIZE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 90, effort: 5 })
      .toBuffer();
    const best = Math.min(smaller.length, input.length);
    if (webpBuffer.length < best * WEBP_MIN_GAIN) writeFileSync(alt, webpBuffer);
    else writeFileSync(none, '');
  }

  const optimized = readFileSync(main);
  writeFileSync(file, optimized);
  let webp = 0;
  if (existsSync(alt)) {
    const webpBuffer = readFileSync(alt);
    writeFileSync(file + '.webp', webpBuffer);
    webp = webpBuffer.length;
  }
  return { before: input.length, after: optimized.length, webp };
}

function walk(dir) {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

export const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} Mo`;

// Lancement direct : node scripts/optimize-images.mjs <projet> [--skip dossier/ …]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [project, ...rest] = process.argv.slice(2);
  if (!project) {
    console.log('Usage : node scripts/optimize-images.mjs <projet angular.json> [--skip dossier/ …]');
    process.exit(1);
  }
  const skip = rest.filter(arg => arg !== '--skip');
  const { files, before, after, webp } = await optimizeImages(project, skip);
  console.log(`✔ ${files} images : ${formatSize(before)} → ${formatSize(after)} (WebP : ${formatSize(webp)})`);
}
