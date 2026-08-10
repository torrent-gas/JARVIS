import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerFinancialProfile, SharedBillingService } from '../../../services/shared-billing.service';
import { BillingPaymentsComponent } from "../../industrial-customer/billing-payments/billing-payments.component";

@Component({
  selector: 'app-corporate-billing-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BillingPaymentsComponent],
  templateUrl: './corporate-billing-list.component.html',
  styleUrls: ['./corporate-billing-list.component.css']
})
export class CorporateBillingListComponent implements OnInit {
  profiles: CustomerFinancialProfile[] = [];
  filteredProfiles: CustomerFinancialProfile[] = [];
  
  // Search & Filter
  searchQuery = '';
  statusFilter = 'All';

  // Corporate Summary KPIs (Requirement 15)
  totalCustomers = 0;
  totalOutstandingCrores = 0;
  totalSecurityCrores = 0;
  totalOverdueCrores = 0;
  overExposedCount = 0;
  nearLimitCount = 0;
  withinLimitCount = 0;

  selectedCustomer: CustomerFinancialProfile | null = null;
  activeTab = 'Overview';

  constructor(private billingService: SharedBillingService) {}

  ngOnInit(): void {
    this.billingService.getProfilesObservable().subscribe(data => {
      this.profiles = data;
      this.applyFilters();
      this.calculateCorporateKPIs();
    });
  }

  calculateCorporateKPIs(): void {
    this.totalCustomers = this.profiles.length;
    
    let outSum = 0;
    let secSum = 0;
    let overdueSum = 0;
    let overExposed = 0;
    let nearLimit = 0;
    let withinLimit = 0;

    this.profiles.forEach(p => {
      outSum += p.outstanding;
      const totalSec = p.paymentSecurityDetails.reduce((acc, s) => acc + s.amount, 0);
      secSum += totalSec;
      overdueSum += p.overdueAmount;

      const util = (p.outstanding / totalSec) * 100;
      if (p.outstanding > totalSec) {
        overExposed++;
      } else if (util >= 80) {
        nearLimit++;
      } else {
        withinLimit++;
      }
    });

    this.totalOutstandingCrores = Number((outSum / 100).toFixed(2));
    this.totalSecurityCrores = Number((secSum / 100).toFixed(2));
    this.totalOverdueCrores = Number((overdueSum / 100).toFixed(2));
    this.overExposedCount = overExposed;
    this.nearLimitCount = nearLimit;
    this.withinLimitCount = withinLimit;
  }

  applyFilters(): void {
    this.filteredProfiles = this.profiles.filter(p => {
      const totalSec = p.paymentSecurityDetails.reduce((acc, s) => acc + s.amount, 0);
      const isOver = p.outstanding > totalSec;
      const util = (p.outstanding / totalSec) * 100;
      const isNear = !isOver && util >= 80;
      const isWithin = !isOver && util < 80;

      let matchStatus = true;
      if (this.statusFilter === 'Over Exposure') matchStatus = isOver;
      if (this.statusFilter === 'Near Limit') matchStatus = isNear;
      if (this.statusFilter === 'Within Limit') matchStatus = isWithin;

      const query = this.searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        p.customerName.toLowerCase().includes(query) ||
        p.customerId.toLowerCase().includes(query);

      return matchStatus && matchSearch;
    });
  }

  getTotalSecurity(p: CustomerFinancialProfile): number {
    return p.paymentSecurityDetails.reduce((acc, s) => acc + s.amount, 0);
  }

  getExposureStatus(p: CustomerFinancialProfile): { label: string, class: string } {
    const totalSec = this.getTotalSecurity(p);
    if (p.outstanding > totalSec) {
      return { label: '🔴 Over Exposure', class: 'status-over-exposure' };
    } else if ((p.outstanding / totalSec) * 100 >= 80) {
      return { label: '⚠ Near Limit', class: 'status-near-limit' };
    } else {
      return { label: '✓ Within Limit', class: 'status-within-limit' };
    }
  }

  selectCustomer(customer: CustomerFinancialProfile): void {
    this.selectedCustomer = customer;
    this.activeTab = 'Overview';
  }

  backToList(): void {
    this.selectedCustomer = null;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}