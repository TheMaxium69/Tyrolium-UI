export interface ITyroUiNavbarPages {
  label: string;
  labelEn?: string;
  link?: string;
  icon?: string;
  children?: ITyroUiNavbarPages[];
  childrenOpen?: boolean;
}
