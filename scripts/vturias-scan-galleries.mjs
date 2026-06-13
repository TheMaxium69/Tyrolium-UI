import { readdirSync, writeFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VTUBER_DIR = join(ROOT, 'projects/vturias-website/public/assets/vtubers');
const OUTPUT = join(ROOT, 'projects/vturias-website/src/app/data/gallery-manifest.generated.ts');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

const manifest = {};
const slugs = readdirSync(VTUBER_DIR).filter(f => !f.startsWith('.'));

for (const slug of slugs) {
  const dir = join(VTUBER_DIR, slug);
  manifest[slug] = readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isFile() && IMAGE_EXTS.has(extname(e.name).toLowerCase()) && !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(e => `assets/vtubers/${slug}/${e.name}`);
}

writeFileSync(OUTPUT, `// AUTO-GENERATED - ne pas éditer manuellement
// Regénérer avec : node scripts/vturias-scan-galleries.mjs
export const GALLERY_MANIFEST: Record<string, string[]> = ${JSON.stringify(manifest, null, 2)};
`);

console.log('✅ Gallery manifest généré pour :', Object.keys(manifest).join(', '));
