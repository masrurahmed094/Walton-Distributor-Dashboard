import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'; // Import router modules
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Import Angular Material modules
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

// Import components
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';
import { SrPerformanceTableComponent } from './components/sr-performance-table/sr-performance-table.component';
import { DistributorReportComponent } from './components/distributor-report/distributor-report.component';
import { SharedModule } from 'src/app/shared/shared.module';

// Define the routes for this feature module
const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent
  }
];

@NgModule({
  declarations: [
    DashboardPageComponent,
    KpiCardComponent,
    HistoricalChartComponent,
    SrPerformanceTableComponent,
    DistributorReportComponent
  ],
  imports: [
    CommonModule,
    // Use RouterModule.forChild(routes) instead of the separate routing module
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgSelectModule,
    NgxChartsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    SharedModule
  ]
})
export class DashboardModule { }

