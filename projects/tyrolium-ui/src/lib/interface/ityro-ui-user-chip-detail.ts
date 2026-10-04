import { TyroUiChipVariant } from '../components/dashboard/tyro-ui-chip/tyro-ui-chip';

/** Étiquette affichée dans la bulle "Détail" d'un tyro-ui-user-chip (ex. "Interne", "Banni"). */
export interface ITyroUiUserChipBadge {
  label:    string;
  variant?: TyroUiChipVariant;
  icon?:    string;
}

/** Ligne d'information de la bulle "Détail" (ex. un email). */
export interface ITyroUiUserChipLine {
  text:  string;
  icon?: string;
}
