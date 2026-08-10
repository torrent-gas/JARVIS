import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerTariffProfile, MasterTariffRecord, MasterTariffsService, TariffCategories } from '../../../services/master-tariffs.service';

@Component({
  selector: 'app-master-tariffs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-tariffs.component.html',
  styleUrls: ['./master-tariffs.component.css']
})
export class MasterTariffsComponent implements OnInit {
  masterTariff!: MasterTariffRecord;
  masterHistory: MasterTariffRecord[] = [];
  customers: CustomerTariffProfile[] = [];
  filteredCustomers: CustomerTariffProfile[] = [];

  // Edit Master Form Inputs
  editMasterMgo = 0;
  editMaster450 = 0;
  editMasterExcess = 0;
  editMasterEffective = '';

  // Confirmation Warning Modal for Master Change
  isMasterWarningModal = false;
  pendingMasterRecord!: MasterTariffRecord;

  // Selected Customer for Override View
  selectedCustomer: CustomerTariffProfile | null = null;
  selectedPricingType: 'Master' | 'Custom' = 'Master';
  custEditMgo: number | null = null;
  custEdit450: number | null = null;
  custEditExcess: number | null = null;

  // Email Preview & Remarks
  isPreviewMode = false;
  customRemarks = 'Please note that the revised tariff will be applicable from the specified effective date. Kindly take note of the updated pricing for your monthly consumption.';

  // Filters & Search
  searchQuery = '';
  filterPricingSource = 'All';
  filterEmailState = 'All';

  // KPIs
  masterCount = 0;
  customCount = 0;

  constructor(private tariffService: MasterTariffsService) {}

  ngOnInit(): void {
    this.tariffService.getMasterObservable().subscribe(master => {
      this.masterTariff = master;
      this.editMasterMgo = master.mgo;
      this.editMaster450 = master.mgo450;
      this.editMasterExcess = master.mgoExcess;
      this.editMasterEffective = master.effectiveFrom;
    });

    this.masterHistory = this.tariffService.getMasterHistory();

    this.tariffService.getCustomersObservable().subscribe(custs => {
      this.customers = custs;
      this.applyFilters();
      this.calculateKPIs();
    });
  }

  calculateKPIs(): void {
    this.masterCount = this.customers.filter(c => c.pricingType === 'Master').length;
    this.customCount = this.customers.filter(c => c.pricingType === 'Custom').length;
  }

  applyFilters(): void {
    this.filteredCustomers = this.customers.filter(c => {
      const matchSource = this.filterPricingSource === 'All' || c.pricingType === this.filterPricingSource;
      const matchEmail = this.filterEmailState === 'All' || 
        (this.filterEmailState === 'Enabled' && c.emailEnabled) || 
        (this.filterEmailState === 'Disabled' && !c.emailEnabled);

      const query = this.searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query);

      return matchSource && matchEmail && matchSearch;
    });
  }

  triggerMasterWarning(): void {
    this.pendingMasterRecord = {
      effectiveFrom: this.editMasterEffective,
      mgo: this.editMasterMgo,
      mgo450: this.editMaster450,
      mgoExcess: this.editMasterExcess,
      revisedBy: 'Marketing Team'
    };
    this.isMasterWarningModal = true;
  }

  cancelMasterUpdate(): void {
    this.isMasterWarningModal = false;
  }

  confirmMasterUpdate(): void {
    this.tariffService.updateMasterTariff(this.pendingMasterRecord);
    this.masterHistory = this.tariffService.getMasterHistory();
    this.isMasterWarningModal = false;
    alert('Master Tariff updated successfully. Applied to all Master-pricing customers.');
  }

  openCustomerDetail(c: CustomerTariffProfile): void {
    this.selectedCustomer = c;
    this.selectedPricingType = c.pricingType;
    this.custEditMgo = c.customPrices.mgo;
    this.custEdit450 = c.customPrices.mgo450;
    this.custEditExcess = c.customPrices.mgoExcess;
    this.isPreviewMode = false;
  }

  backToList(): void {
    this.selectedCustomer = null;
    this.isPreviewMode = false;
  }

  saveCustomerOverride(): void {
    if (this.selectedCustomer) {
      const prices = this.selectedPricingType === 'Custom' ? {
        mgo: this.custEditMgo,
        mgo450: this.custEdit450,
        mgoExcess: this.custEditExcess
      } : { mgo: null, mgo450: null, mgoExcess: null };

      this.tariffService.updateCustomerPricing(this.selectedCustomer.id, this.selectedPricingType, prices);
      alert('Customer pricing preference saved successfully.');
      const updated = this.tariffService.getCustomersObservable().subscribe(list => {
        const found = list.find(x => x.id === this.selectedCustomer?.id);
        if (found) this.selectedCustomer = found;
      });
    }
  }

  resetCustomerToMaster(): void {
    if (this.selectedCustomer) {
      if (confirm(`Reset ${this.selectedCustomer.name} to Master Price?`)) {
        this.tariffService.resetToMaster(this.selectedCustomer.id);
        alert('Customer successfully reset to Master Tariff.');
        const found = this.tariffService.getCustomersObservable().subscribe(list => {
          const x = list.find(item => item.id === this.selectedCustomer?.id);
          if (x) this.openCustomerDetail(x);
        });
      }
    }
  }

  toggleEmailSwitch(c: CustomerTariffProfile, event: any): void {
    this.tariffService.toggleEmailEnabled(c.id, event.target.checked);
  }

  getEffective(c: CustomerTariffProfile): TariffCategories {
    return this.tariffService.getEffectivePrice(c);
  }

  openPreview(): void {
    this.isPreviewMode = true;
  }

  closePreview(): void {
    this.isPreviewMode = false;
  }

  sendEmailForSelected(): void {
    if (this.selectedCustomer) {
      this.tariffService.markEmailsSent([this.selectedCustomer.id]);
      alert(`Tariff email successfully sent to ${this.selectedCustomer.name} (${this.selectedCustomer.email})!`);
      const found = this.tariffService.getCustomersObservable().subscribe(list => {
        const x = list.find(item => item.id === this.selectedCustomer?.id);
        if (x) this.selectedCustomer = x;
      });
      this.backToList();
    }
  }

  sendAllEnabled(): void {
    const enabledIds = this.customers.filter(c => c.emailEnabled).map(c => c.id);
    if (enabledIds.length === 0) {
      alert('No customers have email communication enabled.');
      return;
    }
    if (confirm(`Send monthly tariff revision to all ${enabledIds.length} enabled customers?`)) {
      this.tariffService.markEmailsSent(enabledIds);
      alert(`Monthly tariffs successfully circulated to ${enabledIds.length} customers!`);
    }
  }
}