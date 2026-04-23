export interface ITyroUiNavbarMenuItem {
  name: string;
  description: string;
  image: string;
  imageLight?: string;
  link: string;
  subItems?: ITyroUiNavbarMenuItem[];
  subOpen?: boolean;
  isSubItem?: boolean;
}
