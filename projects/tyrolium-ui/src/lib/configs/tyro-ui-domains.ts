/**
 * Domaines de l'écosystème Tyrolium.
 * Mettre à jour cette liste lors de l'ajout d'un nouveau site.
 * La liste est aussi utilisée dans theme-relay.html (tyrolium-website/public/).
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
] as const;

export type TyroDomain = (typeof TYRO_ECOSYSTEM_DOMAINS)[number];

/** URL de la page relay hébergée sur tyrolium.fr. À fournir via TYRO_RELAY_URL dans les autres sites. */
export const TYRO_THEME_RELAY_URL = 'https://tyrolium.fr/theme-relay.html';
