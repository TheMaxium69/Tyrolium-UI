import { Component, ContentChildren, Directive, Input, OnChanges, QueryList, TemplateRef, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';
import { ITyroUiDataTableColumn } from '../../../interface/ityro-ui-data-table-column';

export type { ITyroUiDataTableColumn };

@Directive({ selector: '[tyroCol]' })
export class TyroUiDataTableColDef {
  @Input('tyroCol') key!: string;
  constructor(public template: TemplateRef<{ $implicit: unknown; row: unknown }>) {}
}

@Component({
  selector: 'tyro-ui-data-table',
  imports: [NgTemplateOutlet, FormsModule],
  templateUrl: './tyro-ui-data-table.html',
  styleUrl: './tyro-ui-data-table.css',
})
export class TyroUiDataTable implements OnChanges {
  @Input() columns: ITyroUiDataTableColumn[] = [];
  @Input() data: unknown[] = [];
  @Input() searchable  = false;
  @Input() filterable  = false;
  @Input() paginated   = false;
  @Input() pageSize    = 10;

  @ContentChildren(TyroUiDataTableColDef) colDefs!: QueryList<TyroUiDataTableColDef>;

  protected readonly lang = inject(TyroUiLangService).lang;

  searchQuery = '';
  columnFilters: Partial<Record<string, string>> = {};
  showFilters  = false;
  sortKey      = '';
  sortDir: 'asc' | 'desc' = 'asc';
  currentPage  = 0;

  get filterableColumns(): ITyroUiDataTableColumn[] {
    return this.columns.filter(c => c.filterable);
  }

  get filteredData(): unknown[] {
    let result = [...this.data] as Record<string, unknown>[];

    if (this.searchable && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(row =>
        this.columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
      );
    }

    if (this.filterable) {
      for (const [key, value] of Object.entries(this.columnFilters)) {
        if (value && value.trim()) {
          const v = value.toLowerCase();
          result = result.filter(row => String(row[key] ?? '').toLowerCase().includes(v));
        }
      }
    }

    if (this.sortKey) {
      result.sort((a, b) => {
        const cmp = String(a[this.sortKey]).localeCompare(String(b[this.sortKey]));
        return this.sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize) || 1;
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const cur   = this.currentPage;
    const start = Math.max(0, cur - 2);
    const end   = Math.min(total - 1, cur + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get displayedData(): unknown[] {
    if (!this.paginated) return this.filteredData;
    const start = this.currentPage * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  sort(key: string): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.currentPage = 0;
  }

  getColDef(key: string): TyroUiDataTableColDef | undefined {
    return this.colDefs?.find(d => d.key === key);
  }

  getValue(row: unknown, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  onSearch(value: string): void {
    this.searchQuery = value;
    this.currentPage = 0;
  }

  onColumnFilter(key: string, value: string): void {
    this.columnFilters[key] = value;
    this.currentPage = 0;
  }

  ngOnChanges(): void {
    this.currentPage = 0;
  }
}
