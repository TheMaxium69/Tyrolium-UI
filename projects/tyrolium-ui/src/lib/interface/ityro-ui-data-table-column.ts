export interface ITyroUiDataTableColumn {
  key: string;
  label: string;
  labelEn?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}
