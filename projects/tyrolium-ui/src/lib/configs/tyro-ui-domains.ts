/**
 * Domaines de l'écosystème Tyrolium.
 * Mettre à jour cette liste lors de l'ajout d'un nouveau site.
 * La liste est aussi utilisée dans public/relay.html (tyrolium-website).
 */
export const TYRO_ECOSYSTEM_DOMAINS = [
  'https://tyrolium.fr',
  'https://solidserv.fr',
  'https://tyrociel.fr',
  'https://gamenium.fr',
  'https://influnias.fr',
  'https://vturias.fr',
  'https://nexiumiacrm.fr',
  'https://useritium.fr',
  'https://tyroserv.fr',
] as const;

export type TyroDomain = (typeof TYRO_ECOSYSTEM_DOMAINS)[number];

/** URL de la page relay hébergée sur tyrolium.fr (sync thème + langue cross-domaine). */
export const TYRO_RELAY_PAGE_URL = 'https://tyrolium.fr/relay.html';
