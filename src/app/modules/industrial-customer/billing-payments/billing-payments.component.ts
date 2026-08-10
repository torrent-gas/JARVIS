import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-billing-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-payments.component.html',
  styleUrls: ['./billing-payments.component.css']
})
export class BillingPaymentsComponent implements AfterViewInit {
  @ViewChild('billingCanvas') billingCanvas!: ElementRef;
  @ViewChild('delayBarCanvas') delayBarCanvas!: ElementRef;

  selectedPlant = 'Plant A - Main Boiler Unit (Gujarat Hub)';
  selectedCycle = 'August 2026 - Fortnightly Cycle #1';

  // Financial & Billing KPIs
  kpis = [
    { title: 'Current Fortnightly Bill', value: '₹ 27,10,250', sub: 'Due Aug 08, 2026', isGreen: false, icon: 'fa-solid fa-file-invoice-dollar' },
    { title: 'Received Payments', value: '₹ 24,00,000', sub: 'Cleared via RTGS / NEFT', isGreen: true, icon: 'fa-solid fa-circle-check' },
    { title: 'Outstanding Balance', value: '₹ 3,10,250', sub: 'Pending Verification', isGreen: false, icon: 'fa-solid fa-clock-rotate-left' },
    { title: 'Accrued Late Interest', value: '₹ 6,972.40', sub: 'At 15.65% p.a. (6 Days Overdue)', isGreen: false, icon: 'fa-solid fa-percent' }
  ];

  billBreakdown = [
    { label: 'MGO Slab Charges (≤ 300 MMBTU)', amount: '₹ 19,97,223' },
    { label: 'Non-MGO Slab Charges (300-500 MMBTU)', amount: '₹ 5,60,000' },
    { label: 'Excess Slab Charges (> 500 MMBTU)', amount: '₹ 1,25,250' },
    { label: 'Statutory Levies & VAT (5%)', amount: '₹ 27,777' },
    { label: 'Total Invoice Payable', amount: '₹ 27,10,250', total: true }
  ];

  // Updated Ledger: 0 delay days correctly yields ₹ 0.00 interest (paid within 5 business days)
  agingLogs = [
    { cycle: 'Aug 2026 (FN1)', dueDate: '08-08-2026', payDate: 'Pending (Aug 14)', extraDays: '6 Days Overdue', interest: '₹ 6,972.40', status: 'Pending' },
    { cycle: 'Jul 2026 (FN2)', dueDate: '25-07-2026', payDate: '06-08-2026', extraDays: '12 Days Delayed', interest: '₹ 15,229.81', status: 'Charged & Paid' },
    { cycle: 'Jul 2026 (FN1)', dueDate: '10-07-2026', payDate: '14-07-2026', extraDays: 'On Time (≤ 5 Days)', interest: '₹ 0.00', status: 'Paid On Time' },
    { cycle: 'Jun 2026 (FN2)', dueDate: '25-06-2026', payDate: '01-07-2026', extraDays: '6 Days Delayed', interest: '₹ 6,251.42', status: 'Charged & Paid' },
    { cycle: 'Jun 2026 (FN1)', dueDate: '12-06-2026', payDate: '14-06-2026', extraDays: 'On Time (≤ 5 Days)', interest: '₹ 0.00', status: 'Paid On Time' }
  ];

  private billingChart: any;
  private delayBarChart: any;

  ngAfterViewInit() {
    this.renderBillingTrendChart();
    this.renderDelayBarChart();
  }

  renderBillingTrendChart() {
    new Chart(this.billingCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jun FN1', 'Jun FN2', 'Jul FN1', 'Jul FN2', 'Aug FN1'],
        datasets: [
          {
            label: 'Invoiced Amount (₹ Lakhs)',
            data: [25.1, 24.3, 26.0, 29.6, 27.1],
            backgroundColor: '#ff6600',
            borderRadius: 6
          },
          {
            label: 'Paid Amount (₹ Lakhs)',
            data: [25.1, 24.3, 26.0, 29.6, 24.0],
            backgroundColor: '#0f172a',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  renderDelayBarChart() {
    new Chart(this.delayBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jun FN1', 'Jun FN2', 'Jul FN1', 'Jul FN2', 'Aug FN1'],
        datasets: [{
          label: 'Extra Delay Days (Beyond 5 Business Days)',
          data: [2, 6, 3, 12, 6], // 0 for on-time cycles
          backgroundColor: ['#10b981', '#ef4444', '#10b981', '#ef4444', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { 
          y: { 
            beginAtZero: true, 
            title: { display: true, text: 'Delay Days' } 
          } 
        }
      }
    });
  }

  downloadInvoicePDF() {
    window.print();
  }
}