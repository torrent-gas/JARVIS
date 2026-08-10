import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../../../data/existing-customers.data';

Chart.register(...registerables);

@Component({
  selector: 'app-slab-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slab-analysis.component.html',
  styleUrls: ['./slab-analysis.component.css'],
})
export class SlabAnalysisComponent implements AfterViewInit {
  @Input() customer?: Customer;
  @Input() embedded = false;
  @ViewChild('slabBarCanvas') slabBarCanvas!: ElementRef;

  selectedPlant = 'plant-a'; 
  customerName = '';
  
  // Slab Totals
  mgoTotal = 0;
  nonMgoTotal = 0;
  excessTotal = 0;

  private slabBarChart: any;
  private isViewInitialized = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSlabData();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.loadSlabData();
  }

  loadSlabData() {
    const jsonUrl = `assets/data/consumption.json`;

    this.http.get<any>(jsonUrl).subscribe({
      next: (data) => {
        const scale = this.customer ? this.customer.currentConsumption / 245 : 1;
        const customerData = { ...data, daily: { ...data.daily, mmbtuData: data.daily.mmbtuData.map((value: number) => value * scale) } };
        this.customerName = this.customer?.name ?? data.customerName;
        this.computeSlabs(customerData.daily.mmbtuData);

        if (this.isViewInitialized) {
          this.renderSlabBarChart(customerData.daily);
        }
      },
      error: (err) => console.error('Error loading slab JSON data:', err),
    });
  }

  computeSlabs(mmbtuList: number[]) {
    this.mgoTotal = 0;
    this.nonMgoTotal = 0;
    this.excessTotal = 0;

    mmbtuList.forEach((val: number) => {
      // DCQ = 300 MMBTU (MGO price applies up to 300)
      // MDCQ = 500 MMBTU (Non-MGO price applies between 300 and 500)
      // Excess = > 500 MMBTU
      const mgo = Math.min(val, 300);
      const nonMgo = Math.max(0, Math.min(val, 500) - 300);
      const excess = Math.max(0, val - 500);

      this.mgoTotal += mgo;
      this.nonMgoTotal += nonMgo;
      this.excessTotal += excess;
    });
  }

  renderSlabBarChart(dailyData: { labels: string[], mmbtuData: number[] }) {
    if (this.slabBarChart) this.slabBarChart.destroy();

    // Compute daily breakdown for each bar
    const dailyMgo: number[] = [];
    const dailyNonMgo: number[] = [];
    const dailyExcess: number[] = [];

    dailyData.mmbtuData.forEach((val: number) => {
      dailyMgo.push(Number(Math.min(val, 300).toFixed(2)));
      dailyNonMgo.push(Number(Math.max(0, Math.min(val, 500) - 300).toFixed(2)));
      dailyExcess.push(Number(Math.max(0, val - 500).toFixed(2)));
    });

    this.slabBarChart = new Chart(this.slabBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: dailyData.labels,
        datasets: [
          {
            label: 'MGO Slab (≤ 300 MMBTU)',
            data: dailyMgo,
            backgroundColor: '#10B981',
            borderRadius: 4
          },
          {
            label: 'Non-MGO Slab (300 - 500 MMBTU)',
            data: dailyNonMgo,
            backgroundColor: '#0A2540',
            borderRadius: 4
          },
          {
            label: 'Excess Slab (> 500 MMBTU)',
            data: dailyExcess,
            backgroundColor: '#EF4444',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true, title: { display: true, text: 'MMBTU' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { weight: 'bold' } } }
        }
      }
    });
  }
}
