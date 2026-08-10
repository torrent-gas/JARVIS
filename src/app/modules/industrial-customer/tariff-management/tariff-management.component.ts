import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { PriceRecord, TARIFF_HISTORY_DATA } from '../../../data/tariff-history.data';

Chart.register(...registerables);

@Component({
  selector: 'app-tariff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tariff-management.component.html',
  styleUrls: ['./tariff-management.component.css']
})
export class TariffManagementComponent implements AfterViewInit {
  @ViewChild('historyCanvas') historyCanvas!: ElementRef;
  @ViewChild('cbCanvas') cbCanvas!: ElementRef;
  @ViewChild('projCanvas') projCanvas!: ElementRef;

  private historyChart: Chart | null = null;
  selectedTimeframe: string = '6m'; // Default: Last 6 Months

  kpis = this.initializeCurrentMonthKPIs();

  ngAfterViewInit() {
    this.renderTariffHistoryChart();
  }

  // Formula: scm_price = (mmbtu_price * 9880) / 252000
  private calculateScmPrice(mmbtu: number): number {
    return (mmbtu * 9880) / 252000;
  }

  initializeCurrentMonthKPIs() {
    // Get the latest current month record from history dataset (e.g., August-26 FN1)
    const latestRecord = TARIFF_HISTORY_DATA[TARIFF_HISTORY_DATA.length - 1];

    const mgoScm = this.calculateScmPrice(latestRecord.mgo);
    const nonMgoScm = this.calculateScmPrice(latestRecord.nonMgo);
    const excessScm = this.calculateScmPrice(latestRecord.excess);

    return [
      { 
        title: 'MGO Price', 
        mmbtuValue: `₹ ${latestRecord.mgo.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        scmValue: `₹ ${mgoScm.toFixed(2)}`, 
        sub: `Effective (${latestRecord.period})`, 
        isGreen: true, 
        icon: 'fa-solid fa-tags' 
      },
      { 
        title: 'Non-MGO Price', 
        mmbtuValue: `₹ ${latestRecord.nonMgo.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        scmValue: `₹ ${nonMgoScm.toFixed(2)}`, 
        sub: `Effective (${latestRecord.period})`, 
        isGreen: false, 
        icon: 'fa-solid fa-tag' 
      },
      { 
        title: 'Excess Price', 
        mmbtuValue: `₹ ${latestRecord.excess.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
        scmValue: `₹ ${excessScm.toFixed(2)}`, 
        sub: `Effective (${latestRecord.period})`, 
        isGreen: false, 
        icon: 'fa-solid fa-triangle-exclamation' 
      }
    ];
  }

  // Triggered when user selects a different timeframe option
  onTimeframeChange() {
    this.renderTariffHistoryChart();
  }

  // Common chart options for clean UI
  private commonOptions: any = {
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false, drawBorder: false } },
      y: { border: { display: false }, grid: { color: '#f1f5f9' } }
    }
  };

  getFilteredData(): PriceRecord[] {
    const totalRecords = TARIFF_HISTORY_DATA.length;
    switch (this.selectedTimeframe) {
      case '6m':
        return TARIFF_HISTORY_DATA.slice(totalRecords - 6);
      case '1y':
        return TARIFF_HISTORY_DATA.slice(totalRecords - 12);
      case '2y':
        return TARIFF_HISTORY_DATA.slice(totalRecords - 24);
      default:
        return TARIFF_HISTORY_DATA;
    }
  }

  renderTariffHistoryChart() {
    const dataSlice = this.getFilteredData();
    const labels = dataSlice.map(item => item.period);
    const mgoData = dataSlice.map(item => item.mgo);
    const nonMgoData = dataSlice.map(item => item.nonMgo);
    const excessData = dataSlice.map(item => item.excess);

    if (this.historyChart) {
      this.historyChart.destroy();
    }

    this.historyChart = new Chart(this.historyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'MGO Price (₹/MMBTU)',
            data: mgoData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2.5,
            pointRadius: 3,
            fill: false,
            tension: 0.3
          },
          {
            label: 'Non-MGO Price (₹/MMBTU)',
            data: nonMgoData,
            borderColor: '#0A2540',
            backgroundColor: 'rgba(10, 37, 64, 0.05)',
            borderWidth: 2.5,
            pointRadius: 3,
            fill: false,
            tension: 0.3
          },
          {
            label: 'Excess Price (₹/MMBTU)',
            data: excessData,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderWidth: 2.5,
            pointRadius: 3,
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f1f5f9' }, title: { display: true, text: '₹ / MMBTU' } }
        }
      }
    });
  }

  exportReport() {
    window.print();
  }
}