import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CUSTOMERS, Customer } from '../../../data/existing-customers.data';

export interface DailyConsumptionRecord extends Customer {
  scdValue: number;
  mmbtuValue: number;
  talentValue: number;
  dailyCommunication: boolean;
  lastSentDate: string;
}

@Component({
  selector: 'app-existing-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './existing-customers.component.html',
  styleUrls: ['./existing-customers.component.css'],
})
export class ExistingCustomersComponent {
  // Master GCV State
  masterGcv: number = 9300;
  tempMasterGcv: number = 9300;
  effectiveGcvDate: string = '10 Aug 2026';

  // Map existing customers, setting consumption to 0 if not commissioned
  customers: DailyConsumptionRecord[] = CUSTOMERS.map((c, index) => {
    const isCommissioned = c.contractStatus === 'Active' || c.contractStatus === 'Expiring soon';
    
    const scdValue = isCommissioned ? Math.round(c.dcq * 28.3168 * (0.85 + (index % 5) * 0.04)) : 0;
    const mmbtuValue = isCommissioned ? Number(((scdValue * 9300) / 252000).toFixed(2)) : 0;
    const talentValue = isCommissioned ? Math.round(mmbtuValue * 1250) : 0;

    return {
      ...c,
      scdValue,
      mmbtuValue,
      talentValue,
      dailyCommunication: isCommissioned && (index % 2 === 0),
      lastSentDate: isCommissioned && (index % 2 === 0) ? '10 Aug 2026 (08:00 AM)' : '—'
    };
  });

  search = '';
  type = '';
  industry = '';
  status = '';
  location = '';
  sort = 'name';
  page = 1;
  pageSize = 8;

  // Dynamic KPI Calculations for Customer Status Breakdown
  get totalCustomers(): number {
    return this.customers.length;
  }

  get commissionedCustomers(): number {
    return this.customers.filter(c => c.contractStatus === 'Active' || c.contractStatus === 'Expiring soon').length;
  }

  get agreementYetToCommission(): number {
    return this.customers.filter(c => c.contractStatus === 'Renewal due').length;
  }

  // Apply Master GCV calculation only across commissioned customers
  applyMasterGcv(): void {
    this.masterGcv = this.tempMasterGcv;
    this.customers.forEach(c => {
      const isCommissioned = c.contractStatus === 'Active' || c.contractStatus === 'Expiring soon';
      if (isCommissioned) {
        c.mmbtuValue = Number(((c.scdValue * this.masterGcv) / 252000).toFixed(2));
        c.talentValue = Math.round(c.mmbtuValue * 1250);
      } else {
        c.scdValue = 0;
        c.mmbtuValue = 0;
        c.talentValue = 0;
      }
    });
    alert(`Master GCV updated to ${this.masterGcv} kcal/SCM and successfully applied to commissioned customers!`);
  }

  getCustomerStatusLabel(contractStatus: string): string {
    if (contractStatus === 'Active' || contractStatus === 'Expiring soon') {
      return 'Commissioned';
    } else {
      return 'Agreement Signed – Yet to Commission';
    }
  }

  get filtered(): DailyConsumptionRecord[] {
    const query = this.search.trim().toLowerCase();
    return this.customers
      .filter(
        (c) =>
          (!query ||
            [c.name, c.id, c.contractNumber, c.email, c.phone].some((x) =>
              x.toLowerCase().includes(query),
            )) &&
          (!this.type || c.type === this.type) &&
          (!this.industry || c.industry === this.industry) &&
          (!this.status || c.contractStatus === this.status) &&
          (!this.location || c.location === this.location),
      )
      .sort((a, b) =>
        this.sort === 'expiry'
          ? a.expiry.localeCompare(b.expiry)
          : this.sort === 'dcq'
            ? b.dcq - a.dcq
            : a.name.localeCompare(b.name),
      );
  }

  get displayed(): DailyConsumptionRecord[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get pages(): number {
    return Math.ceil(this.filtered.length / this.pageSize) || 1;
  }

  resetPage(): void {
    this.page = 1;
  }

  clearFilters(): void {
    this.search = this.type = this.industry = this.status = this.location = '';
    this.resetPage();
  }

  toggleDailyCommunication(customer: DailyConsumptionRecord, event: any): void {
    const isCommissioned = customer.contractStatus === 'Active' || customer.contractStatus === 'Expiring soon';
    if (!isCommissioned) {
      customer.dailyCommunication = false;
      event.target.checked = false;
      alert('Cannot enable daily communication for uncommissioned customers.');
      return;
    }
    customer.dailyCommunication = event.target.checked;
  }

  sendMorningDispatchNow(): void {
    const enabledCount = this.customers.filter(c => c.dailyCommunication).length;
    const today = '10 Aug 2026 (08:00 AM)';
    this.customers.forEach(c => {
      if (c.dailyCommunication) {
        c.lastSentDate = today;
      }
    });
    alert(`Morning consumption summary & MMBTU details (calculated using Master GCV: ${this.masterGcv} kcal/SCM) successfully dispatched to ${enabledCount} commissioned customers with Daily Communication = ON.`);
  }
}