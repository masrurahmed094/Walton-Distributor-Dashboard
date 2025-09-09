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
  processedChartData: any[] = [];

  // ngx-charts options
  legend: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Sales Amount';
  legendPosition = LegendPosition.Below;
  colorScheme = 'vivid';
  animations: boolean = true; // <-- This property was missing

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
    const monthLabels = ['4 Months Ago', '3 Months Ago', '2 Months Ago', 'Last Month'];

    this.processedChartData = [{
      name: distributor.distributorName,
      series: [
        { name: monthLabels[0], value: distributor.sales4MonthsAgo },
        { name: monthLabels[1], value: distributor.sales3MonthsAgo },
        { name: monthLabels[2], value: distributor.sales2MonthsAgo },
        { name: monthLabels[3], value: distributor.salesLastMonth },
      ]
    }];
  }
}