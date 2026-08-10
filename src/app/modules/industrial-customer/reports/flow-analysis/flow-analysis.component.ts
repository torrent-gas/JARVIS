import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../../../data/existing-customers.data';

Chart.register(...registerables);

@Component({
  selector: 'app-flow-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flow-analysis.component.html',
  styleUrls: ['./flow-analysis.component.css'],
})
export class FlowAnalysisComponent implements AfterViewInit {
  @Input() customer?: Customer;
  @Input() embedded = false;
  @ViewChild('dailyCanvas') dailyCanvas!: ElementRef;

  kpis: any[] = [];
  customerName = '';
  
  // Alert evaluation variables
  isLowEfficiency = false;
  efficiencyValue = 0;

  isMaxFlowAlert = false;
  maxFlowValue = 368;

  peakDemand: number = 0;

  private dailyChart: any;
  private isViewInitialized = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPlantData();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.loadPlantData();
  }

  loadPlantData() {
    const jsonUrl = `assets/data/consumption.json`;

    this.http.get<any>(jsonUrl).subscribe({
      next: (data) => {
        const scale = this.customer ? this.customer.currentConsumption / 245 : 1;
        const customerData = { ...data, daily: { ...data.daily, mmbtuData: data.daily.mmbtuData.map((value: number) => value * scale), peakFlowData: data.daily.peakFlowData.map((value: number) => value * scale) } };
        this.customerName = this.customer?.name ?? data.customerName;
        this.computeKPIs(customerData.daily);

        if (this.isViewInitialized) {
          this.updateCharts(customerData);
        }
      },
      error: (err) => console.error('Error loading plant JSON profile:', err),
    });
  }

  computeKPIs(dailyData: { labels: string[], scmData: number[], mmbtuData: number[], peakFlowData: number[] }) {
    const mmbtuList = dailyData.mmbtuData;
    const peakFlowList = dailyData.peakFlowData;
    
    // 1. Today's Consumption: Last entry in mmbtuData
    const todaysConsumption = mmbtuList.length > 0 ? mmbtuList[mmbtuList.length - 1] : 0;
    const activeDate = dailyData.labels.length > 0 ? dailyData.labels[dailyData.labels.length - 1] : '';

    // 2. Peak Demand: Maximum peak flowrate (SCM/hr)
    this.peakDemand = peakFlowList.length > 0 ? Math.max(...peakFlowList) : 0;

    // 3. Monthly Average Consumption: Mean of mmbtuData till date
    const totalMmbtu = mmbtuList.reduce((acc, val) => acc + val, 0);
    const monthlyAvg = mmbtuList.length > 0 ? totalMmbtu / mmbtuList.length : 0;

    // 4. Efficiency Index: Percentage of monthly average against DCQ value (Benchmark = 250 MMBTU)
    const dcqValue = 300.0; 
    const efficiencyIndex = (monthlyAvg / dcqValue) * 100;

    this.efficiencyValue = Number(efficiencyIndex.toFixed(2));
    this.isLowEfficiency = this.efficiencyValue < 90.0;
    this.isMaxFlowAlert = this.peakDemand > this.maxFlowValue;

    this.kpis = [
      {
        title: "Today's Consumption",
        value: `${todaysConsumption.toFixed(2)} MMBTU`,
        sub: `Active Date: ${activeDate}`,
        alert: false
      },
      {
        title: "Monthly Avg Consumption",
        value: `${monthlyAvg.toFixed(2)} MMBTU`,
        sub: "Average Till Date",
        alert: false
      },
      {
        title: "Minimum Obligation (DCQ)",
        value: '270 MMBTU',
        sub: "90% of DCQ value",
        alert: false
      },
      {
        title: "Efficiency Index",
        value: `${this.efficiencyValue}%`,
        sub: this.isLowEfficiency ? "Below 90% Threshold!" : "Optimal Performance",
        alert: this.isLowEfficiency
      }
    ];
  }

  updateCharts(data: any) {
    if (this.dailyChart) this.dailyChart.destroy();
    
    this.dailyChart = new Chart(this.dailyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.daily.labels,
        datasets: [
          {
            label: 'Daily Consumption (MMBTU)',
            data: data.daily.mmbtuData,
            borderColor: '#ff6600',
            backgroundColor: 'rgba(255, 102, 0, 0.1)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Peak Flowrate (SCM/hr)',
            data: data.daily.peakFlowData,
            borderColor: '#0f172a',
            backgroundColor: 'rgba(15, 23, 42, 0.05)',
            hidden: true,
            tension: 0.3,
          }
        ],
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }
}
