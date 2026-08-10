import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TariffCategories {
  mgo: number;
  mgo450: number;
  mgoExcess: number;
}

export interface MasterTariffRecord extends TariffCategories {
  effectiveFrom: string;
  revisedBy: string;
}

export interface CustomerOverride {
  isCustom: boolean;
  mgo?: number;
  mgo450?: number;
  mgoExcess?: number;
}

export interface CustomerTariffProfile {
  id: string;
  name: string;
  email: string;
  pricingType: 'Master' | 'Custom';
  customPrices: {
    mgo: number | null;
    mgo450: number | null;
    mgoExcess: number | null;
  };
  emailEnabled: boolean;
  emailStatus: 'Not Enabled' | 'Scheduled' | 'Sent' | 'Failed' | 'Pending';
  sentOn: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterTariffsService {
  // Master Tariff State
  private currentMaster: MasterTariffRecord = {
    effectiveFrom: '01 August 2026',
    mgo: 50.00,
    mgo450: 55.00,
    mgoExcess: 65.00,
    revisedBy: 'Marketing Team'
  };

  private masterHistory: MasterTariffRecord[] = [
    { effectiveFrom: '01 August 2026', mgo: 50.00, mgo450: 55.00, mgoExcess: 65.00, revisedBy: 'Marketing Team' },
    { effectiveFrom: '01 July 2026', mgo: 49.00, mgo450: 54.00, mgoExcess: 64.00, revisedBy: 'Marketing Team' },
    { effectiveFrom: '01 June 2026', mgo: 48.00, mgo450: 53.00, mgoExcess: 62.00, revisedBy: 'Marketing Team' }
  ];

  private mockCustomers: CustomerTariffProfile[] = [
    {
      id: 'CUST-001',
      name: 'Wheels India Ltd.',
      email: 'customer@abc.com',
      pricingType: 'Custom',
      customPrices: {
        mgo: 48.00,
        mgo450: null, // Inherits master
        mgoExcess: 62.00
      },
      emailEnabled: true,
      emailStatus: 'Sent',
      sentOn: '01 Aug 2026'
    },
    {
      id: 'CUST-002',
      name: 'Godrej & Boyce Pvt. Ltd.',
      email: 'customer@xyzmfg.com',
      pricingType: 'Master',
      customPrices: {
        mgo: null,
        mgo450: null,
        mgoExcess: null
      },
      emailEnabled: true,
      emailStatus: 'Sent',
      sentOn: '01 Aug 2026'
    },
    {
      id: 'CUST-003',
      name: 'Brakes India Pvt.Ltd.',
      email: 'customer@brakesindia.com',
      pricingType: 'Master',
      customPrices: {
        mgo: null,
        mgo450: null,
        mgoExcess: null
      },
      emailEnabled: false,
      emailStatus: 'Not Enabled',
      sentOn: '—'
    }
  ];

  private masterSubject = new BehaviorSubject<MasterTariffRecord>(this.loadMasterStorage());
  private customersSubject = new BehaviorSubject<CustomerTariffProfile[]>(this.loadCustomerStorage());

  private loadMasterStorage(): MasterTariffRecord {
    const saved = localStorage.getItem('master_tariff_current');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return this.currentMaster;
  }

  private loadCustomerStorage(): CustomerTariffProfile[] {
    const saved = localStorage.getItem('master_customer_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return this.mockCustomers;
  }

  private saveMasterStorage(master: MasterTariffRecord): void {
    localStorage.setItem('master_tariff_current', JSON.stringify(master));
    this.masterSubject.next(master);
  }

  private saveCustomerStorage(customers: CustomerTariffProfile[]): void {
    localStorage.setItem('master_customer_profiles', JSON.stringify(customers));
    this.customersSubject.next(customers);
  }

  getMasterObservable(): Observable<MasterTariffRecord> {
    return this.masterSubject.asObservable();
  }

  getCustomersObservable(): Observable<CustomerTariffProfile[]> {
    return this.customersSubject.asObservable();
  }

  getMasterHistory(): MasterTariffRecord[] {
    return this.masterHistory;
  }

  updateMasterTariff(newMaster: MasterTariffRecord): void {
    this.masterHistory = [newMaster, ...this.masterHistory];
    this.saveMasterStorage(newMaster);
  }

  toggleEmailEnabled(id: string, enabled: boolean): void {
    const list = this.customersSubject.getValue();
    const updated = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          emailEnabled: enabled,
          emailStatus: enabled ? ('Pending' as const) : ('Not Enabled' as const)
        };
      }
      return c;
    });
    this.saveCustomerStorage(updated);
  }

  updateCustomerPricing(id: string, pricingType: 'Master' | 'Custom', customPrices: { mgo: number | null, mgo450: number | null, mgoExcess: number | null }): void {
    const list = this.customersSubject.getValue();
    const updated = list.map(c => {
      if (c.id === id) {
        return {
          ...c,
          pricingType,
          customPrices: pricingType === 'Master' ? { mgo: null, mgo450: null, mgoExcess: null } : customPrices
        };
      }
      return c;
    });
    this.saveCustomerStorage(updated);
  }

  resetToMaster(id: string): void {
    this.updateCustomerPricing(id, 'Master', { mgo: null, mgo450: null, mgoExcess: null });
  }

  getEffectivePrice(customer: CustomerTariffProfile): TariffCategories {
    const master = this.masterSubject.getValue();
    return {
      mgo: (customer.pricingType === 'Custom' && customer.customPrices.mgo !== null) ? customer.customPrices.mgo : master.mgo,
      mgo450: (customer.pricingType === 'Custom' && customer.customPrices.mgo450 !== null) ? customer.customPrices.mgo450 : master.mgo450,
      mgoExcess: (customer.pricingType === 'Custom' && customer.customPrices.mgoExcess !== null) ? customer.customPrices.mgoExcess : master.mgoExcess
    };
  }

  markEmailsSent(ids: string[]): void {
    const list = this.customersSubject.getValue();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const updated = list.map(c => {
      if (ids.includes(c.id) && c.emailEnabled) {
        return { ...c, emailStatus: 'Sent' as const, sentOn: today };
      }
      return c;
    });
    this.saveCustomerStorage(updated);
  }
}