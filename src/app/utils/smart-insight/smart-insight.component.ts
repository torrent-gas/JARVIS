import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-smart-insight',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="insight-banner" [ngClass]="type">
      <div class="insight-icon">
        <i [class]="icon"></i>
      </div>
      <div class="insight-content">
        <div class="insight-header">
          <h4>{{ title }}</h4>
          <span class="badge">AI Recommendation</span>
        </div>
        <p>{{ message }}</p>
        <div class="insight-actions" *ngIf="actionLabel">
          <button class="btn-insight" (click)="onAction.emit()">
            {{ actionLabel }} <i class="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .insight-banner {
      display: flex; gap: 1.25rem; padding: 1.5rem;
      border-radius: 12px; margin-bottom: 2rem;
      border: 1px solid;
    }
    .insight-banner.warning {
      background-color: #fffbeb; border-color: #fcd34d; color: #92400e;
    }
    .insight-banner.info {
      background-color: #f0f9ff; border-color: #bae6fd; color: #075985;
    }
    .insight-icon {
      font-size: 2rem; flex-shrink: 0;
      display: flex; align-items: flex-start;
    }
    .warning .insight-icon { color: #d97706; }
    .info .insight-icon { color: #0284c7; }
    
    .insight-content { flex-grow: 1; }
    .insight-header {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;
    }
    .insight-header h4 { margin: 0; font-size: 1.125rem; font-weight: 700; }
    .badge {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      padding: 0.25rem 0.5rem; border-radius: 20px; letter-spacing: 0.05em;
    }
    .warning .badge { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .info .badge { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    
    .insight-content p { margin: 0 0 1rem 0; font-size: 0.9375rem; line-height: 1.5; }
    
    .btn-insight {
      background: #ffffff; border: 1px solid; padding: 0.5rem 1rem;
      border-radius: 6px; font-weight: 600; font-size: 0.875rem;
      cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;
      transition: all 0.2s;
    }
    .warning .btn-insight { border-color: #fcd34d; color: #92400e; }
    .warning .btn-insight:hover { background: #fef3c7; }
  `]
})
export class SmartInsightComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() type: 'warning' | 'info' = 'info';
  @Input() icon: string = 'ri-lightbulb-flash-line';
  @Input() actionLabel?: string;
  @Output() onAction = new EventEmitter<void>();
}