import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer } from '../data/existing-customers.data';

export interface ConsumptionReportData {
  customerName: string;
  daily: {
    labels: string[];
    scmData: number[];
    mmbtuData: number[];
    peakFlowData: number[];
  };
}

export interface PressureReportData {
  plantName: string;
  kpis: Array<{ title: string; value: string; sub: string; alert: boolean }>;
  pressureTimeline: {
    labels: string[];
    actual: number[];
    thresholdMin: number[];
    thresholdMax: number[];
  };
  pressureDistribution: {
    labels: string[];
    data: number[];
  };
  lowPressureEvents: Array<{ timestamp: string; duration: string; minPressure: string; impact: string; status: string }>;
  events: Array<{ eventId: string; timestamp: string; type: string; severity: string; pressureVal: string; actionTaken: string }>;
}

export interface BillingReportData {
  plantName: string;
  kpis: Array<{ title: string; value: string; sub: string; alert: boolean }>;
  monthlyTrend: {
    labels: string[];
    actual: number[];
    projected: number[];
  };
  costDistribution: {
    labels: string[];
    data: number[];
  };
  budgetUtilization: {
    spent: number;
    remaining: number;
    totalAllocated: string;
    totalSpent: string;
  };
  invoices: Array<{ invoiceNo: string; billingPeriod: string; totalConsumption: string; amount: string; status: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerReportDataService {
  private http = inject(HttpClient);
  private baselineConsumption = 245;

  loadConsumptionData(customer: Customer | null): Observable<ConsumptionReportData> {
    return this.http.get<ConsumptionReportData>('assets/data/consumption.json').pipe(
      map((data) => {
        const scale = customer ? customer.currentConsumption / this.baselineConsumption : 1;
        return {
          ...data,
          customerName: customer?.name ?? data.customerName,
          daily: {
            ...data.daily,
            scmData: data.daily.scmData.map((value) => Number((value * scale).toFixed(2))),
            mmbtuData: data.daily.mmbtuData.map((value) => Number((value * scale).toFixed(2))),
            peakFlowData: data.daily.peakFlowData.map((value) => Number((value * scale).toFixed(2))),
          },
        };
      }),
    );
  }

  loadPressureData(): Observable<PressureReportData> {
    return this.http.get<PressureReportData>('assets/data/pressure-plant-a.json');
  }

  loadBillingData(): Observable<BillingReportData> {
    return this.http.get<BillingReportData>('assets/data/cost-plant-a.json');
  }
}
