import { Component, Input } from '@angular/core';
import { DistributorReport } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-distributor-report',
  templateUrl: './distributor-report.component.html',
  styleUrls: ['./distributor-report.component.scss']
})
export class DistributorReportComponent {
  @Input() reportData: DistributorReport[] | null = [];

  constructor() { }
}