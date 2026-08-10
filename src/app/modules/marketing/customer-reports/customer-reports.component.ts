import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Customer, getCustomer } from '../../../data/existing-customers.data';
import { ReportContainerComponent } from "../../industrial-customer/reports/report-container/report-container.component";

type ReportKey = 'overview' | 'consumption' | 'cost' | 'contract';

@Component({
  selector: 'app-customer-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReportContainerComponent
],
  templateUrl: './customer-reports.component.html',
  styleUrls: ['./customer-reports.component.css'],
})
export class CustomerReportsComponent {
  customer: Customer = getCustomer(this.route.snapshot.paramMap.get('id'));
  selected: ReportKey = 'overview';
  dateRange = 'This month';
  shift = 'All shifts';
  meter = 'Main meter';
  reports: Array<{ key: ReportKey; label: string; icon: string }> = [
    {
      key: 'overview',
      label: 'Customer Overview',
      icon: 'ri-dashboard-3-line',
    },
    {
      key: 'consumption',
      label: 'Consumption & Flow',
      icon: 'ri-line-chart-line',
    },
    { key: 'cost', label: 'Cost & Billing', icon: 'ri-funds-line' },
    {
      key: 'contract',
      label: 'Contract & Allocation',
      icon: 'ri-file-shield-2-line',
    },
  ];
  constructor(private route: ActivatedRoute) {}
  get dcqUse() {
    return Math.round(
      (this.customer.currentConsumption / this.customer.dcq) * 100,
    );
  }
  get mdcqUse() {
    return Math.round((this.customer.peakDaily / this.customer.mdcq) * 100);
  }
  get mjoUse() {
    return Math.round(this.dcqUse * 0.93);
  }
  reportTitle() {
    return (
      this.reports.find((r) => r.key === this.selected)?.label ?? 'Overview'
    );
  }
}
