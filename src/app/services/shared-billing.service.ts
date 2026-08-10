import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BankGuarantee {
  bgNumber: string;
  issuingBank: string;
  amount: number; // in Lakhs
  issueDate: string;
  expiryDate: string;
  securityType: 'Bank Guarantee' | 'Security Deposit' | 'Monetary Deposit';
  validityStatus: 'Active' | 'Expiring Soon' | 'Expired';
  renewalDate: string;
}

export interface Invoice {
  invoiceNo: string;
  billingPeriod: string;
  billDate: string;
  dueDate: string;
  billAmount: number; // in ₹
  paidAmount: number; // in ₹
  outstandingAmount: number; // in ₹
  status: 'Paid' | 'Partially Paid' | 'Due' | 'Overdue';
}

export interface PaymentTransaction {
  paymentDate: string;
  referenceNo: string;
  invoiceNo: string;
  amount: number; // in ₹
  paymentMode: 'RTGS' | 'NEFT' | 'Bank Transfer';
  status: 'Cleared' | 'Reconciled' | 'Pending';
}

export interface CustomerFinancialProfile {
  customerId: string;
  customerName: string;
  currentBill: number; // in Lakhs
  outstanding: number; // in Lakhs
  overdueAmount: number; // in Lakhs
  notYetDueAmount: number; // in Lakhs
  overdueInvoicesCount: number;
  oldestOutstandingDays: number;
  paymentSecurityDetails: BankGuarantee[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
}

@Injectable({
  providedIn: 'root'
})
export class SharedBillingService {
  private mockProfiles: CustomerFinancialProfile[] = [
    {
      customerId: 'CUST-001',
      customerName: 'WHEELS INDIA LIMITED (THERVOYKANDIGAI)',
      currentBill: 27.10,
      outstanding: 27.10,
      overdueAmount: 0.00,
      notYetDueAmount: 27.10,
      overdueInvoicesCount: 0,
      oldestOutstandingDays: 0,
      paymentSecurityDetails: [
        {
          bgNumber: 'BG-2025-9941',
          issuingBank: 'HDFC Bank Corporate Branch',
          amount: 20.00,
          issueDate: '10 Jan 2025',
          expiryDate: '10 Jan 2027',
          securityType: 'Bank Guarantee',
          validityStatus: 'Active',
          renewalDate: '10 Dec 2026'
        },
        {
          bgNumber: 'SD-TN-8821',
          issuingBank: 'State Bank of India',
          amount: 10.00,
          issueDate: '15 Mar 2024',
          expiryDate: '15 Mar 2028',
          securityType: 'Security Deposit',
          validityStatus: 'Active',
          renewalDate: '15 Feb 2028'
        }
      ],
      invoices: [
        { invoiceNo: 'INV-2026-081', billingPeriod: 'Aug 2026 (FN1)', billDate: '01 Aug 2026', dueDate: '08 Aug 2026', billAmount: 2710250, paidAmount: 2400000, outstandingAmount: 310250, status: 'Partially Paid' },
        { invoiceNo: 'INV-2026-072', billingPeriod: 'Jul 2026 (FN2)', billDate: '20 Jul 2026', dueDate: '25 Jul 2026', billAmount: 2960000, paidAmount: 0, outstandingAmount: 2960000, status: 'Overdue' },
        { invoiceNo: 'INV-2026-071', billingPeriod: 'Jul 2026 (FN1)', billDate: '05 Jul 2026', dueDate: '10 Jul 2026', billAmount: 2600000, paidAmount: 2600000, outstandingAmount: 0, status: 'Paid' }
      ],
      payments: [
        { paymentDate: '06 Aug 2026', referenceNo: 'TXN-8841-2026', invoiceNo: 'INV-2026-081', amount: 2400000, paymentMode: 'RTGS', status: 'Cleared' },
        { paymentDate: '14 Jul 2026', referenceNo: 'TXN-8210-2026', invoiceNo: 'INV-2026-071', amount: 2600000, paymentMode: 'NEFT', status: 'Cleared' }
      ]
    },
    {
      customerId: 'CUST-002',
      customerName: 'Godrej & Boyce Pvt. Ltd.',
      currentBill: 35.00,
      outstanding: 42.00,
      overdueAmount: 28.00,
      notYetDueAmount: 14.00,
      overdueInvoicesCount: 3,
      oldestOutstandingDays: 65,
      paymentSecurityDetails: [
        {
          bgNumber: 'BG-2025-4412',
          issuingBank: 'ICICI Bank Industrial Finance',
          amount: 30.00,
          issueDate: '01 Feb 2025',
          expiryDate: '01 Feb 2026',
          securityType: 'Bank Guarantee',
          validityStatus: 'Expiring Soon',
          renewalDate: '15 Jan 2026'
        }
      ],
      invoices: [
        { invoiceNo: 'INV-XYZ-041', billingPeriod: 'Aug 2026', billDate: '01 Aug 2026', dueDate: '08 Aug 2026', billAmount: 3500000, paidAmount: 0, outstandingAmount: 3500000, status: 'Overdue' }
      ],
      payments: [
        { paymentDate: '02 Jul 2026', referenceNo: 'TXN-XYZ-991', invoiceNo: 'INV-XYZ-039', amount: 3000000, paymentMode: 'RTGS', status: 'Cleared' }
      ]
    },
    {
      customerId: 'CUST-003',
      customerName: 'Brakes India Pvt.Ltd.',
      currentBill: 12.50,
      outstanding: 8.00,
      overdueAmount: 0.00,
      notYetDueAmount: 8.00,
      overdueInvoicesCount: 0,
      oldestOutstandingDays: 4,
      paymentSecurityDetails: [
        {
          bgNumber: 'BG-CHN-1102',
          issuingBank: 'Axis Bank Corporate',
          amount: 15.00,
          issueDate: '12 May 2025',
          expiryDate: '12 May 2027',
          securityType: 'Bank Guarantee',
          validityStatus: 'Active',
          renewalDate: '12 Apr 2027'
        }
      ],
      invoices: [
        { invoiceNo: 'INV-CHN-012', billingPeriod: 'Aug 2026', billDate: '01 Aug 2026', dueDate: '08 Aug 2026', billAmount: 1250000, paidAmount: 450000, outstandingAmount: 800000, status: 'Due' }
      ],
      payments: [
        { paymentDate: '05 Aug 2026', referenceNo: 'TXN-CHN-332', invoiceNo: 'INV-CHN-012', amount: 450000, paymentMode: 'NEFT', status: 'Cleared' }
      ]
    }
  ];

  private profilesSubject = new BehaviorSubject<CustomerFinancialProfile[]>(this.mockProfiles);

  getProfilesObservable(): Observable<CustomerFinancialProfile[]> {
    return this.profilesSubject.asObservable();
  }

  getProfiles(): CustomerFinancialProfile[] {
    return this.profilesSubject.getValue();
  }

  getCustomerProfile(customerId: string): CustomerFinancialProfile | undefined {
    return this.getProfiles().find(p => p.customerId === customerId);
  }
}