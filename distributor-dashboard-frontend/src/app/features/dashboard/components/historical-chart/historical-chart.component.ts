import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { HistoricalPerformance } from '../../../../core/models/dashboard.model';
// FIX: Import the necessary types for the color scheme object
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoricalChartComponent implements OnChanges {
  @Input() chartData: HistoricalPerformance[] | null = [];
  processedChartData: { name: string; value: number }[] = [];

  // --- ngx-charts options ---
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Sales Amount';
  animations: boolean = true;
  gradient: boolean = true;
  showGridLines: boolean = true;
  legend: boolean = false; 

  // --- FIX: The colorScheme object now has the correct structure ---
  // This conforms to the 'Color' type that ngx-charts expects.
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.transformData();
    }
  }

  private transformData(): void {
    if (!this.chartData || this.chartData.length === 0) {
      this.processedChartData = [];
      return;
    }
    const distributor = this.chartData[0]; 

    this.processedChartData = [
      { name: '4 Months Ago', value: distributor.sales4MonthsAgo },
      { name: '3 Months Ago', value: distributor.sales3MonthsAgo },
      { name: '2 Months Ago', value: distributor.sales2MonthsAgo },
      { name: 'Last Month', value: distributor.salesLastMonth },
    ];
  }
}

