import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SrPerformance } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-sr-performance-table',
  templateUrl: './sr-performance-table.component.html',
  styleUrls: ['./sr-performance-table.component.scss']
})
export class SrPerformanceTableComponent implements OnChanges {
  @Input() performanceData: SrPerformance[] | null = [];

  sortedData: SrPerformance[] = [];
  sortColumn: keyof SrPerformance = 'totalInvoicedAmount';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['performanceData'] && this.performanceData) {
      this.sortedData = [...this.performanceData];
      this.sortData();
    } else {
      this.sortedData = [];
    }
  }

  sortBy(column: keyof SrPerformance): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.sortData();
  }

  private sortData(): void {
    if (!this.sortColumn) return;

    this.sortedData.sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}