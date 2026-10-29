// npm run tyrobuild -- <site|all> [--apache|--nginx]
//
//   npm run tyrobuild -- tyrolium          → build tyrolium-website et le place dans prod/Tyrolium-WebSite
//   npm run tyrobuild -- ip speedtest      → plusieurs sites à la suite
//   npm run tyrobuild -- all               → tous les sites de la liste SITES
//   npm run tyrobuild -- ip --apache       → force le serveur (sinon : valeur "server" de SITES)
//
// Pour chaque site : build de production (pré-rendu), optimisation des images (+ WebP), vidage du dossier prod (sauf .git & co),
// copie du build (avec sitemap.xml + robots.txt), puis génération de la config serveur (.htaccess pour Apache, .tyro-nginx.conf pour Nginx).
// Ne fait ni commit ni push.

import { execSync } from 'child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateSitemap } from './generate-sitemap.mjs';
import { generateTxt } from './generate-txt.mjs';
import { generateRss } from './generate-rss.mjs';
import { formatSize, optimizeImages } from './optimize-images.mjs';
import { generateImages } from './generate-images.mjs';

const ROOT   = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(ROOT, 'scripts/server-config');

/** Jamais supprimés du dossier prod (dépôt git de déploiement) */
const KEEP = ['.git', '.gitignore', '.github', '.tyrogit', '.DS_Store'];

/**
 * key      : nom court utilisé en ligne de commande
 * project  : projet angular.json
 * prod     : dossier dans prod/
 * domain   : nom de domaine (server_name Nginx) ; '_' = page par défaut du serveur, sans domaine fixe
 * server   : 'apache' | 'nginx', ou ['apache', 'nginx'] pour un site déployé sur les deux
 * nginxRoot: dossier du site sur le serveur Nginx (défaut : /var/www/<domain>)
 * excludes : dossiers laissés en comportement natif (présents uniquement sur le serveur)
 * php      : le site contient / appelle des scripts PHP sur le même domaine (Nginx : phpSocket, défaut php8.3-fpm)
 * phpFront : Nginx, dossier dont les URLs passent toutes par son index.php (ex. '/api')
 * robots   : chemins toujours ajoutés en Disallow dans robots.txt (dossiers propres au serveur)
 * gone     : anciennes URLs supprimées définitivement → 410 (elles et tout ce qu'elles contiennent)
 * preserve : fichiers du dossier prod à conserver tels quels (config propre au serveur), jamais écrasés par le build
 * imagesKeep: dossiers d'images laissés intacts par l'optimisation (téléchargements en pleine qualité)
 * hsts     : false pour ne pas envoyer HSTS (ex. page par défaut d'un serveur, certificat pas garanti)
 * rss      : flux RSS d'une section (pages datées par publishedAt) : { section, file, title }
 * prebuild : commande à lancer avant le build
 */
const SITES = [
  { key: 'tyrolium',    project: 'tyrolium-website',    prod: 'Tyrolium-WebSite',        domain: 'tyrolium.fr',           server: 'apache', excludes: ['Download', 'generate-pp', 'Contenu/Image'],
    robots: ['/Contenu/', '/Download/', '/generate-pp/'], gone: ['ServerMC', 'Panel'],
    imagesKeep: ['assets/wallpapers/'],
    rss: { section: '/etudes-de-cas/', file: 'rss.xml', title: 'Tyrolium - Études de cas' } },
  { key: 'solidserv',   project: 'solidserv-website',   prod: 'SolidServ-WebSite',       domain: 'solidserv.fr',          server: 'apache' },
  { key: 'tyrociel',    project: 'tyrociel-website',    prod: 'TyroCiel-WebSite',        domain: 'tyrociel.fr',           server: 'apache' },
  { key: 'influnias',   project: 'influnias-website',   prod: 'Influnias-WebSite',       domain: 'influnias.fr',          server: 'apache' },
  { key: 'nexiumiacrm', project: 'nexiumiacrm-website', prod: 'NexiumiaCRM-SiteWeb',     domain: 'nexiumiacrm.fr',        server: 'apache' },
  { key: 'useritium',   project: 'useritium-website',   prod: 'Useritium-WebSite',       domain: 'useritium.fr',          server: 'apache', excludes: ['api-externe', 'Download'],
    robots: ['/api-externe/', '/Download/'] },
  { key: 'vturias',     project: 'vturias-website',     prod: 'Vturias-WebSite',         domain: 'vturias.fr',            server: 'apache', prebuild: 'node scripts/vturias-scan-galleries.mjs' },
  { key: 'gamenium',    project: 'gamenium-website',    prod: 'Gamenium-WebSite',        domain: 'gamenium.fr',           server: 'apache' },
  { key: 'tyroserv',    project: 'tyroserv-website',    prod: 'TyroServ-WebSite',        domain: 'tyroserv.fr',           server: 'apache' },
  { key: 'design',      project: 'tyrolium-design',     prod: 'Tyrolium-Design',         domain: 'design.tyrolium.fr',    server: 'apache' },
  { key: 'ip',          project: 'tyrolium-ip',         prod: 'Tyrolium-Ip',             domain: 'ip.tyrolium.fr',        server: 'nginx',  php: true, phpFront: '/api',
    robots: ['/api/'] },
  { key: 'uptime',      project: 'tyrolium-uptime',     prod: 'Tyrolium-ServerTemplate', domain: '_',                     server: ['apache', 'nginx'],
    nginxRoot: '/var/www/<serveur>.tyrolium.fr', preserve: ['assets/server.json'], hsts: false },
  { key: 'maintenance', project: 'tyrolium-maintenance', prod: 'Tyrolium-Maintenance',   domain: '_',                     server: ['apache', 'nginx'],
    nginxRoot: '/var/www/<serveur>.tyrolium.fr', hsts: false },
  { key: 'speedtest',   project: 'tyrolium-speedtest',  prod: 'Tyrolium-SpeedTest',      domain: 'speedtest.tyrolium.fr', server: 'nginx',  php: true, uploads: true },
];

/* ─── Arguments ─────────────────────────────────────────────────────── */

const args   = process.argv.slice(2);
const forced = args.includes('--nginx') ? 'nginx' : args.includes('--apache') ? 'apache' : null;
const names  = args.filter(a => !a.startsWith('--'));

if (!names.length) {
  console.log('Usage : npm run tyrobuild -- <site|all> [--apache|--nginx]\n');
  console.log('Sites : ' + SITES.map(s => s.key).join(', '));
  process.exit(1);
}

const targets = names.includes('all') ? SITES : names.map(name => {
  const site = SITES.find(s => s.key === name || s.project === name || s.prod === name);
  if (!site) {
    console.error(`✘ Site inconnu : "${name}". Sites : ${SITES.map(s => s.key).join(', ')}`);
    process.exit(1);
  }
  return site;
});

/* ─── Build ─────────────────────────────────────────────────────────── */

// Images générées dans les sources (images de partage 1200×630, miniatures des fonds d'écran) : seulement si manquantes ou périmées
const generated = await generateImages();
if (generated) console.log(`✔ ${generated} image(s) générée(s) dans les sources (images de partage / miniatures) : à commiter`);

const results = [];
for (const site of targets) {
  const servers = forced ? [forced] : [].concat(site.server);
  const server  = servers.join(' + ');
  console.log(`\n━━━ ${site.key} → prod/${site.prod} (${server}) ━━━`);
  try {
    await deploy(site, servers);
    results.push({ site, server, ok: true });
  } catch (err) {
    console.error(`✘ ${site.key} : ${err.message}`);
    results.push({ site, server, ok: false });
  }
}

console.log('\n━━━ Résumé ━━━');
for (const { site, server, ok } of results) {
  console.log(`${ok ? '✔' : '✘'} ${site.key.padEnd(12)} prod/${site.prod} (${server})`);
}
console.log('\nRien n\'a été commité ni poussé : vérifier puis commit/push depuis chaque dossier prod/.');
if (results.some(r => !r.ok)) process.exit(1);

async function deploy(site, servers) {
  const dist = join(ROOT, 'dist', site.project, 'browser');
  const prod = join(ROOT, 'prod', site.prod);
  if (!existsSync(prod)) throw new Error(`dossier prod/${site.prod} introuvable`);

  if (site.prebuild) run(site.prebuild);
  run(`npx ng build ${site.project} --configuration production`);
  if (!existsSync(join(dist, 'index.html'))) throw new Error(`build introuvable dans ${dist}`);

  // Images du build : redimensionnées, recompressées + version WebP (les sources ne sont jamais modifiées)
  const images = await optimizeImages(site.project, site.imagesKeep);
  console.log(`✔ ${images.files} images : ${formatSize(images.before)} → ${formatSize(images.after)} (WebP : ${formatSize(images.webp)})`);

  // Pré-rendu si Angular a produit la coquille SPA à côté des pages générées
  const prerendered = existsSync(join(dist, 'index.csr.html'));
  if (prerendered) {
    // Comparé au déploiement précédent (encore dans prod/) pour dater chaque page (<lastmod>)
    const { pages, changed, sitemap } = generateSitemap(site.project, prod, site.robots);
    console.log(sitemap ? `✔ sitemap.xml (${pages} pages, ${changed} modifiée(s) depuis le dernier déploiement) + robots.txt` : '✔ robots.txt (site en noindex, pas de sitemap)');
  }

  // Présentation du site pour les IA (llms.txt), crédits (humans.txt), contact sécurité (.well-known/security.txt)
  const txt = generateTxt(site.project);
  console.log(txt.llms ? `✔ llms.txt (${txt.pages} pages) + humans.txt + .well-known/security.txt` : '✔ humans.txt + .well-known/security.txt (pas de llms.txt : site en noindex ou non pré-rendu)');

  // Flux RSS d'une section (articles datés par publishedAt)
  if (prerendered && site.rss) {
    const feed = generateRss(site.project, site.rss);
    console.log(`✔ ${feed.file} (flux RSS : ${feed.items} articles)`);
  }

  // Fichiers propres au serveur : mis de côté avant le vidage, remis après la copie
  const preserved = (site.preserve ?? [])
    .filter(file => existsSync(join(prod, file)))
    .map(file => ({ file, content: readFileSync(join(prod, file)) }));

  // Vider le dossier prod (ancien build + ancienne config serveur), sauf git & co
  for (const entry of readdirSync(prod)) {
    if (!KEEP.includes(entry)) rmSync(join(prod, entry), { recursive: true, force: true });
  }
  cpSync(dist, prod, { recursive: true });
  for (const { file, content } of preserved) writeFileSync(join(prod, file), content);
  if (preserved.length) console.log(`✔ conservé(s) : ${preserved.map(p => p.file).join(', ')}`);
  // Coquille SPA vide d'Angular : jamais servie par notre config (les URLs inconnues répondent 404),
  // et accessible en direct elle serait une page vide indexable → on ne la déploie pas
  if (prerendered) rmSync(join(prod, 'index.csr.html'), { force: true });

  // Une config par serveur (un site peut être déployé à la fois sur Apache et sur Nginx)
  const files = servers.map(server => {
    const file = server === 'nginx' ? '.tyro-nginx.conf' : '.htaccess';
    writeFileSync(join(prod, file), server === 'nginx' ? nginxConfig(site, prerendered) : apacheConfig(site, prerendered));
    return file;
  });
  const file = files.join(' + ');

  const changes = execSync('git status --short', { cwd: prod }).toString().trim().split('\n').filter(Boolean).length;
  console.log(`✔ ${prerendered ? 'pré-rendu' : 'SPA'} copié + ${file} généré (${changes} fichier(s) modifié(s) dans prod/${site.prod})`);
}

function run(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

/* ─── Config Apache ─────────────────────────────────────────────────── */

function apacheConfig(site, prerendered) {
  const excludes = site.excludes?.length
    ? `  RewriteRule ^(${site.excludes.join('|')})($|/) - [L]`
    : '  # (aucun)';

  const gone = site.gone?.length
    ? `  RewriteRule ^(${site.gone.join('|')})(/.*)?$ - [R=410,L]`
    : '  # (aucune)';

  const routing = prerendered ? `\
  # /404, /403 et /410 (et /en/…) visités directement : ils renvoient aussi leur vrai code
  RewriteRule ^(en/)?404/?$ - [R=404,L]
  RewriteRule ^(en/)?403/?$ - [R=403,L]
  RewriteRule ^(en/)?410/?$ - [R=410,L]

  # Fichier existant (assets, scripts, styles…) → servi tel quel
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  # Page pré-rendue : /equipe → /equipe/index.html (sans redirection vers /equipe/)
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.+?)/?$ /$1/index.html [L]

  # Tout le reste n'existe pas : pas de réécriture, Apache répond 404
  # (ou 403 pour un dossier sans page) avec la page d'erreur pré-rendue ci-dessous` : `\
  # Fichier ou dossier existant → servi tel quel
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Sinon, point d'entrée d'Angular (le routeur affiche la bonne page)
  RewriteRule ^ /index.html [L]`;

  const errors = prerendered ? `\
# Empêche Apache de rediriger /equipe vers /equipe/ (301) : les pages pré-rendues sont des dossiers
DirectorySlash Off

# Vrai code HTTP + page d'erreur pré-rendue (Angular affiche la même page au démarrage)
ErrorDocument 404 /404/index.html
ErrorDocument 403 /403/index.html
ErrorDocument 410 /410/index.html` : `\
# Site non pré-rendu : Angular gère les erreurs côté navigateur
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
ErrorDocument 410 /index.html`;

  return fill('apache.htaccess', {
    SITE: site.domain === '_' ? site.prod : site.domain, MODE: prerendered ? 'pré-rendu' : 'SPA',
    GONE: gone, EXCLUDES: excludes, ROUTING: routing, ERRORS: errors, HSTS: apacheHsts(site),
  });
}

/**
 * HSTS : « pendant 7 jours, ne viens ici qu'en HTTPS ». Durée volontairement courte :
 * si un certificat tombe, le blocage dure au plus une semaine. Sans includeSubDomains ni preload.
 * Ignoré par les navigateurs s'il arrive en HTTP : on peut l'envoyer sans condition.
 * (fonction plutôt que constante : appelée pendant la boucle de build, avant la fin du fichier)
 */
function hsts() {
  return 'max-age=604800';
}

function apacheHsts(site) {
  return site.hsts === false
    ? '  # (pas de HSTS sur ce site : option hsts: false dans scripts/tyrobuild.mjs)'
    : `  # HTTPS obligatoire pendant 7 jours (durée courte : si le certificat tombe, blocage d'une semaine au plus)\n  Header always set Strict-Transport-Security "${hsts()}"`;
}

/* ─── Config Nginx ──────────────────────────────────────────────────── */

/** En-têtes de sécurité Nginx ("always" : aussi sur les pages d'erreur), indentés pour leur bloc */
function nginxSecurity(site, indent) {
  return [
    `add_header X-Frame-Options "SAMEORIGIN" always;`,
    `add_header Content-Security-Policy "frame-ancestors 'self'" always;`,
    `add_header X-Content-Type-Options "nosniff" always;`,
    `add_header Referrer-Policy "strict-origin-when-cross-origin" always;`,
    `add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`,
    ...(site.hsts === false ? [] : [`add_header Strict-Transport-Security "${hsts()}" always;`]),
  ].map(line => indent + line).join('\n');
}

function nginxConfig(site, prerendered) {
  const excludes = (site.excludes ?? []).map(dir => `\
# Dossier exclu : comportement natif
location ^~ /${dir}/ { try_files $uri $uri/ =404; }

`).join('');

  const gone = site.gone?.length ? `\
# Pages supprimées définitivement : 410 dit aux moteurs de les retirer pour de bon
location ~ ^/(${site.gone.join('|')})(/|$) { return 410; }

` : '';

  const routing = gone + excludes + (prerendered ? `\
# Fichier existant, sinon page pré-rendue (/equipe → /equipe/index.html),
# sinon dossier (403 s'il n'a pas de page), sinon 404
location / {
    try_files $uri $uri/index.html $uri/ =404;
    # Pages HTML : même nom à chaque déploiement → toujours revalidées
    add_header Cache-Control "no-cache";
${nginxSecurity(site, '    ')}
}

# Vrai code HTTP + page d'erreur pré-rendue (Angular affiche la même page au démarrage)
error_page 404 /404/index.html;
error_page 403 /403/index.html;
error_page 410 /410/index.html;

# /404, /403 et /410 (et /en/…) visités directement : ils renvoient aussi leur vrai code
location ~ ^(/en)?/404/?$ { return 404; }
location ~ ^(/en)?/403/?$ { return 403; }
location ~ ^(/en)?/410/?$ { return 410; }
` : `\
# Fichier ou dossier existant, sinon point d'entrée d'Angular
location / {
    try_files $uri $uri/ /index.html;
    # Pages HTML : même nom à chaque déploiement → toujours revalidées
    add_header Cache-Control "no-cache";
${nginxSecurity(site, '    ')}
}
`);

  const front = site.phpFront ? `
# API PHP : toute URL sous ${site.phpFront}/ qui n'est pas un fichier passe par ${site.phpFront}/index.php
location ${site.phpFront}/ {
    try_files $uri $uri/ ${site.phpFront}/index.php?$query_string;
}
` : '';

  const php = site.php ? `${front}
# PHP (scripts du site / API sur le même domaine)
# → socket de PHP-FPM : option phpSocket de tyrobuild (ls /run/php/)
location ~ \\.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass ${site.phpSocket ?? 'unix:/run/php/php8.3-fpm.sock'};
}
` : '';

  const extra = site.uploads ? `
# Test d'upload du speedtest : gros envois de données
client_max_body_size 100M;
` : '';

  return fill('nginx.conf', {
    SITE: site.domain === '_' ? site.prod : site.domain, MODE: prerendered ? 'pré-rendu' : 'SPA',
    // Page par défaut : un même build sur chaque serveur, sous le nom du serveur (ex. vps222.tyrolium.fr)
    DOMAIN: site.domain === '_' ? '<serveur>.tyrolium.fr _' : site.domain,
    CONF_NAME: site.domain === '_' ? '<serveur>.tyrolium.fr' : site.domain,
    ROOT: site.nginxRoot ?? `/var/www/${site.domain}`,
    // Page par défaut du serveur (sans domaine fixe) : répond à toute requête qui ne correspond à aucun autre site
    LISTEN_HINT: site.domain === '_' ? '\n#       listen 443 ssl default_server;   (page par défaut : toute requête sans site dédié)' : '',
    INDEX: site.php ? 'index.html index.php' : 'index.html',
    PHP_HINT: site.php ? ', PHP' : '', PHP_REMOVE: site.php ? `, "location ~ \\.php$"${site.phpFront ? `, "location ${site.phpFront}"` : ''}` : '',
    EXTRA: extra, ROUTING: routing, PHP: php,
    SECURITY: nginxSecurity(site, ''), SECURITY_IN: nginxSecurity(site, '    '),
  });
}

function fill(template, values) {
  return readFileSync(join(CONFIG, template), 'utf8')
    .replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');
}
