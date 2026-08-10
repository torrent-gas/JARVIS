import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlowAnalysisComponent } from '../flow-analysis/flow-analysis.component';
import { SlabAnalysisComponent } from '../slab-analysis/slab-analysis.component';

@Component({
  selector: 'app-report-container',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FlowAnalysisComponent,
    SlabAnalysisComponent
  ],
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.css']
})
export class ReportContainerComponent {
  
  // --- Global Filter State ---
  selectedReportType = 'consumption'; // 'consumption' | 'cost' | 'pressure'
  selectedDateRange = 'this-month';    // 'today' | 'this-week' | 'this-month' | 'custom'
  selectedPlant = 'plant-a';           // Shared global plant selection

  // Triggered when global filters change
  onGlobalFilterChange() {
    console.log('Global Filters Updated:', {
      reportType: this.selectedReportType,
      dateRange: this.selectedDateRange,
      plant: this.selectedPlant
    });
    // You can also emit or pass these filter values down to child components via @Input properties if needed.
  }
}