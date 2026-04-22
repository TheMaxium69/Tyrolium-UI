export interface ITyroUiNavbarPages {
  label: string;
  link?: string;
  icon?: string;
  children?: ITyroUiNavbarPages[];
  childrenOpen?: boolean;
  color?: string;
}
