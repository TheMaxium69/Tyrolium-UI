export interface ITyroUiNavbarMenuItem {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  image?: string;
  imageLight?: string;
  icon?: string;
  link: string;
  host?: string;
  subItems?: ITyroUiNavbarMenuItem[];
  subOpen?: boolean;
  isSubItem?: boolean;
}
