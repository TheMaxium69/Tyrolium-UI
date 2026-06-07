export interface ITyroUiNavbarPages {
  label: string;
  labelEn?: string;
  link?: string;
  href?: string;
  ancreHost?: string;
  ancre?: string;
  icon?: string;
  children?: ITyroUiNavbarPages[];
  childrenOpen?: boolean;
}
