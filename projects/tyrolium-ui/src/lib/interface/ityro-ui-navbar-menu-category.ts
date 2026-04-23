import { ITyroUiNavbarMenuItem } from './ityro-ui-navbar-menu-item';

export interface ITyroUiNavbarMenuCategory {
  label: string;
  labelEn?: string;
  open: boolean;
  items: ITyroUiNavbarMenuItem[];
}
