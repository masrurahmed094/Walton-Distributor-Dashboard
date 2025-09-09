import { Component, Input } from '@angular/core';
import { KpiResponse } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent {
  // The title of the KPI card, e.g., "Purchase Amount"
  @Input() title: string = '';

  // The data object for the KPI, typically from a KpiResponse
  @Input() data: KpiResponse | null = null;

  // A flag to show the loading state
  @Input() isLoading: boolean = true;

  // Determines how the main value is formatted ('currency' or 'number')
  @Input() format: 'currency' | 'number' = 'currency';

  // --- Optional Inputs for Progress Bar ---
  // The current value for progress calculation (e.g., IMS Invoiced)
  @Input() progressValue: number | null = null;
  // The total value for progress calculation (e.g., IMS Target)
  @Input() progressTotal: number | null = null;

  /**
   * Calculates the progress percentage for the progress bar.
   * @returns {number} The calculated percentage.
   */
  get progressPercentage(): number {
    if (this.progressTotal && this.progressValue && this.progressTotal > 0) {
      return (this.progressValue / this.progressTotal) * 100;
    }
    return 0;
  }

  /**
   * Determines the color for the progress bar based on the percentage.
   * @returns {'primary' | 'accent' | 'warn'} The color name for MatProgressBar.
   */
  get progressColor(): 'primary' | 'accent' | 'warn' {
    const percentage = this.progressPercentage;
    if (percentage < 50) return 'warn'; // Red
    if (percentage < 90) return 'accent'; // Yellow
    return 'primary'; // Green
  }
}
