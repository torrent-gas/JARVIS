import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private http = inject(HttpClient);

  getDashboardData() {
    return this.http.get<any>('/assets/data/dashboard.json');
  }

}