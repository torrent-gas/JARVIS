import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon" [ngClass]="themeColor">
        <i [class]="icon"></i>
      </div>
      <div class="stat-details">
        <span class="stat-title">{{ title }}</span>
        <div class="stat-value-group">
          <span class="stat-value">{{ value }}</span>
          <span class="stat-unit" *ngIf="unit">{{ unit }}</span>
        </div>
        <div class="stat-trend" *ngIf="trendLabel" [ngClass]="trendType">
          <i [class]="trendType === 'up' ? 'ri-arrow-right-up-line' : (trendType === 'down' ? 'ri-arrow-right-down-line' : 'ri-subtract-line')"></i>
          <span>{{ trendLabel }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
    }
    .stat-icon {
      width: 48px; height: 48px;
      border-radius: 10px;
      display: flex; justify-content: center; align-items: center;
      font-size: 1.5rem; flex-shrink: 0;
    }
    .blue { background: #e6f0fa; color: #0054A6; }
    .green { background: #f1f9ec; color: #78C043; }
    .orange { background: #fff7ed; color: #ea580c; }
    .stat-details { display: flex; flex-direction: column; }
    .stat-title { font-size: 0.8125rem; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; }
    .stat-value-group { display: flex; align-items: baseline; gap: 0.25rem; }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
    .stat-unit { font-size: 0.875rem; color: #64748b; font-weight: 500; }
    .stat-trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem; }
    .up { color: #ea580c; } /* Up is usually bad for consumption */
    .down { color: #16a34a; } /* Down is usually good/savings */
    .neutral { color: #64748b; }
  `]
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: number;
  @Input() unit?: string;
  @Input() icon!: string;
  @Input() themeColor: 'blue' | 'green' | 'orange' = 'blue';
  @Input() trendLabel?: string;
  @Input() trendType?: 'up' | 'down' | 'neutral';
}