import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { KpiResponse } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent implements OnChanges {
  // --- EXISTING PROPERTIES ---
  @Input() title: string = 'KPI Title';
  @Input() data: KpiResponse | null = null;
  @Input() isLoading: boolean = true;
  @Input() format: 'currency' | 'number' = 'number';
  @Input() progressTotal: number | null = null;

  // --- NEW PROPERTY FOR THE ICON ---
  @Input() iconSvgPath: string = ''; // Accepts an SVG path string for the icon

  // --- PROGRESS BAR LOGIC ---
  progressPercentage: number = 0;
  progressColor: 'primary' | 'accent' | 'warn' = 'primary';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Recalculate progress bar when data changes
    if (changes['data'] || changes['progressTotal']) {
      this.calculateProgress();
    }
  }

  private calculateProgress(): void {
    if (this.data && this.progressTotal && this.progressTotal > 0) {
      this.progressPercentage = Math.round((this.data.amount / this.progressTotal) * 100);
      
      // Determine color based on percentage
      if (this.progressPercentage < 40) {
        this.progressColor = 'warn';
      } else if (this.progressPercentage < 80) {
        this.progressColor = 'accent';
      } else {
        this.progressColor = 'primary';
      }
    } else {
      this.progressPercentage = 0;
    }
  }
}

