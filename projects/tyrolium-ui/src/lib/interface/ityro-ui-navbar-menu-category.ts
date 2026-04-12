import { ITyroUiNavbarMenuItem } from './ityro-ui-navbar-menu-item';

export interface ITyroUiNavbarMenuCategory {
  label: string;
  open: boolean;
  items: ITyroUiNavbarMenuItem[];
}
