export interface ITyroUiDashNavSubItem {
  label: string;
  icon: string;
  iconImg?: string;
  link: string;
}

export interface ITyroUiDashNavChild {
  label: string;
  icon: string;
  iconImg?: string;
  link?: string;
  children?: ITyroUiDashNavSubItem[];
  open?: boolean;
}

export interface ITyroUiDashNavItem {
  label: string;
  icon?: string;
  iconImg?: string;
  link?: string;
  href?: string;
  category?: boolean;
  children?: ITyroUiDashNavChild[];
  open?: boolean;
  spacer?: boolean;
}
