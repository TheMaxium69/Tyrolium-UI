export interface ITyroUiNavbarMenuItem {
  name: string;
  description: string;
  image: string;
  link: string;
  iconBg?: string;
  subItems?: ITyroUiNavbarMenuItem[];
  subOpen?: boolean;
  isSubItem?: boolean;
}
