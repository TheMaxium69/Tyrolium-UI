export interface ITyroUiNavbarPages {
  label: string;
  labelEn?: string;
  link?: string;
  ancre?: string;
  icon?: string;
  children?: ITyroUiNavbarPages[];
  childrenOpen?: boolean;
}
