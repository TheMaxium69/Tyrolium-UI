/**
 * Domaines de l'écosystème Tyrolium.
 * Mettre à jour cette liste lors de l'ajout d'un nouveau site.
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
