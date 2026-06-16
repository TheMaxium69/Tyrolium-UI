// npm run generate-favicons
// Requires: npm install --save-dev sharp

// npm run "start faviconscript"
// Requires: npm install --save-dev sharp

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT     = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS   = join(ROOT, 'projects/tyrolium-ui/src/styles/assets/projects');
const OUT      = join(ASSETS, 'onglets');

const SIZES = [
  { suffix: '16x',  px: 16  },
  { suffix: '32x',  px: 32  },
  { suffix: '180x', px: 180 },
];

const LOGOS = [
  'Tyrolium',
  'TyroServ',
  'SolidServ',
  'Influnias',
  'Vturias',
  'TyroCiel',
  'Gamenium',
  'NexiumiaCRM',
  'Useritium',
];

(async () => {
  await mkdir(OUT, { recursive: true });

  for (const logo of LOGOS) {
    console.log(`\n▸ ${logo}`);
    const src = join(ASSETS, `${logo}.png`);
    for (const { suffix, px } of SIZES) {
      const dest = join(OUT, `${logo}-${suffix}.png`);
      await sharp(src)
        .resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(dest);
      console.log(`  ✓ ${logo}-${suffix}.png (${px}×${px})`);
    }
  }

  console.log('\n✅ Favicons générés dans assets/projects/onglets/\n');
})();
