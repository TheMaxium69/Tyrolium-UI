export interface ITyroUiDashNavChild {
  label: string;
  icon: string;
  link: string;
}

export interface ITyroUiDashNavItem {
  label: string;
  icon: string;
  link?: string;
  children?: ITyroUiDashNavChild[];
  open?: boolean;
}
