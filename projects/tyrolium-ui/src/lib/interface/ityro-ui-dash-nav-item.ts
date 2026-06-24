export interface ITyroUiDashNavChild {
  label: string;
  icon: string;
  iconImg?: string;
  link: string;
}

export interface ITyroUiDashNavItem {
  label: string;
  icon: string;
  iconImg?: string;
  link?: string;
  children?: ITyroUiDashNavChild[];
  open?: boolean;
}
