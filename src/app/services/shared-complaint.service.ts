import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ComplaintHistoryItem {
  date: string;
  action: string;
}

export interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  category: string;
  subject: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  raisedOn: string;
  status: 'Open' | 'Assigned' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed';
  lastUpdated: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  accountManager: string;
  resolutionSummary?: string;
  closingRemarks?: string;
  history: ComplaintHistoryItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SharedComplaintService {
  // Initial shared mock data mirroring the industrial customer complaints
  private initialComplaints: Complaint[] = [
    {
      id: 'CMP-1024',
      customerId: 'CUST-001',
      customerName: 'WHEELS INDIA LIMITED (THERVOYKANDIGAI)',
      category: 'Gas Supply',
      subject: 'Low Gas Pressure',
      description: 'Customer experiencing low inlet pressure on the main boiler line during peak operating hours.',
      priority: 'High',
      raisedOn: '06 Aug 2026',
      status: 'In Progress',
      lastUpdated: '08 Aug 2026',
      contactName: 'Ramesh Kumar',
      email: 'ramesh.kumar@wheelsindia.com',
      phone: '+91 98765 43210',
      location: 'Thervoykandigai Plant, Tamil Nadu',
      accountManager: 'Mr. Arvind Sharma',
      history: [
        { date: '06 Aug 2026', action: 'Complaint Raised' },
        { date: '06 Aug 2026', action: 'Assigned to Operations Team' },
        { date: '07 Aug 2026', action: 'Technician Visit Scheduled' },
        { date: '08 Aug 2026', action: 'Issue Under Investigation' }
      ]
    },
    {
      id: 'CMP-1025',
      customerId: 'CUST-002',
      customerName: 'Godrej & Boyce Pvt. Ltd.',
      category: 'Billing',
      subject: 'Discrepancy in MGO Slab Calculation',
      description: 'Invoice calculation query regarding the 300 MMBTU threshold slab allocation.',
      priority: 'Medium',
      raisedOn: '07 Aug 2026',
      status: 'Open',
      lastUpdated: '07 Aug 2026',
      contactName: 'Suresh Patel',
      email: 'suresh@xyzmfg.com',
      phone: '+91 91234 56789',
      location: 'Vadodara Unit, Gujarat',
      accountManager: 'Ms. Priya Nair',
      history: [
        { date: '07 Aug 2026', action: 'Complaint Raised' }
      ]
    },
    {
      id: 'CMP-1026',
      customerId: 'CUST-003',
      customerName: 'Brakes India Pvt.Ltd.',
      category: 'Meter',
      subject: 'Corrected Flowrate Meter Calibration Error',
      description: 'Smart corrector showing intermittent error code E-04 on pulse output.',
      priority: 'Critical',
      raisedOn: '08 Aug 2026',
      status: 'Resolved',
      lastUpdated: '10 Aug 2026',
      contactName: 'Karthik Raja',
      email: 'karthik@brakesindia.com',
      phone: '+91 99887 76655',
      location: 'Manali Industrial Area, Chennai',
      accountManager: 'Mr. Arvind Sharma',
      resolutionSummary: 'Meter electronics reset and calibration verified on-site by field technician.',
      closingRemarks: 'Customer confirmed correct pulse readings and normal operation.',
      history: [
        { date: '08 Aug 2026', action: 'Complaint Raised' },
        { date: '08 Aug 2026', action: 'Assigned to Instrumentation Team' },
        { date: '09 Aug 2026', action: 'Field Inspection Completed' },
        { date: '10 Aug 2026', action: 'Resolved' }
      ]
    }
  ];

  private complaintsSubject = new BehaviorSubject<Complaint[]>(this.loadFromStorage());

  constructor() {}

  private loadFromStorage(): Complaint[] {
    const saved = localStorage.getItem('shared_industrial_complaints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local storage complaints', e);
      }
    }
    return this.initialComplaints;
  }

  private saveToStorage(complaints: Complaint[]) {
    localStorage.setItem('shared_industrial_complaints', JSON.stringify(complaints));
    this.complaintsSubject.next(complaints);
  }

  getComplaintsObservable(): Observable<Complaint[]> {
    return this.complaintsSubject.asObservable();
  }

  getComplaints(): Complaint[] {
    return this.complaintsSubject.getValue();
  }

  addComplaint(newComplaint: Omit<Complaint, 'id' | 'lastUpdated' | 'history'>): Complaint {
    const complaints = this.getComplaints();
    const id = `CMP-${1024 + complaints.length}`;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const complaint: Complaint = {
      ...newComplaint,
      id,
      lastUpdated: today,
      history: [{ date: today, action: 'Complaint Raised' }]
    };

    const updated = [complaint, ...complaints];
    this.saveToStorage(updated);
    return complaint;
  }

  updateComplaintStatus(id: string, newStatus: Complaint['status'], actionNote?: string): void {
    const complaints = this.getComplaints();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = complaints.map(c => {
      if (c.id === id) {
        const historyAction = actionNote || `Status changed to ${newStatus}`;
        return {
          ...c,
          status: newStatus,
          lastUpdated: today,
          history: [...c.history, { date: today, action: historyAction }]
        };
      }
      return c;
    });

    this.saveToStorage(updated);
  }

  closeComplaint(id: string, resolutionSummary: string, closingRemarks: string): void {
    const complaints = this.getComplaints();
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Closed' as const,
          resolutionSummary,
          closingRemarks,
          lastUpdated: today,
          history: [...c.history, { date: today, action: 'Complaint Closed' }]
        };
      }
      return c;
    });

    this.saveToStorage(updated);
  }
}