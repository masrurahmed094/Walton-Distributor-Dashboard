import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HistoricalPerformance } from '../../../../core/models/dashboard.model';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoricalChartComponent implements OnChanges {
  @Input() chartData: HistoricalPerformance[] | null = [];
  processedChartData: { name: string; value: number }[] = []; // Simplified structure for bar chart

  // --- ngx-charts options for a Vertical Bar Chart ---
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Sales Amount';
  animations: boolean = true;
  gradient: boolean = true; // Added for better visuals on a bar chart
  showGridLines: boolean = true;
  
  // A legend is not needed for a single-series bar chart
  legend: boolean = false; 

  // You can customize the color scheme
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.transformData();
    }
  }

  // --- MODIFIED: This function now creates a flat data structure ---
  private transformData(): void {
    if (!this.chartData || this.chartData.length === 0) {
      this.processedChartData = [];
      return;
    }

    // Since we are showing data for one distributor at a time
    const distributor = this.chartData[0]; 

    // Create a flat array of objects, which is the format ngx-charts expects for a simple bar chart.
    this.processedChartData = [
      { name: '4 Months Ago', value: distributor.sales4MonthsAgo },
      { name: '3 Months Ago', value: distributor.sales3MonthsAgo },
      { name: '2 Months Ago', value: distributor.sales2MonthsAgo },
      { name: 'Last Month', value: distributor.salesLastMonth },
    ];
  }
}
